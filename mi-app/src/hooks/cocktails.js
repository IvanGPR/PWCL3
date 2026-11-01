
import { useEffect, useRef, useState } from 'react';

import {
  obtenerCocktails,
  obtenerCocktailsCategoria,
  obtenerCocktailsIngrediente,
  obtenerDetalleCocktail,
  obtenerCocktailAleatorio
} from '../api.js';

import {
  ordenarCocktails,
  obtenerMensajeResultados,
  obtenerMensajeCategoria,
  obtenerMensajeError
} from '../logic.js';

const VISTA_INICIAL = {
  tipo: 'inicio',
  cocktails: [],
  detalle: null,
  origen: 'lista',
  mensaje: '',
  incluirRecuento: false
};

export default function useCocktails() {
  const [vista, setVista] = useState(VISTA_INICIAL);
  const [cargando, setCargando] = useState(false);

  const controladorActual = useRef(null);

  useEffect(() => {
    return () => {
      controladorActual.current?.abort();
    };
  }, []);

  function cancelarPeticion() {
    controladorActual.current?.abort();
    controladorActual.current = null;
    setCargando(false);
  }

  async function ejecutarPeticion(consulta, mensajeCarga, procesar) {
    cancelarPeticion();

    const controlador = new AbortController();
    controladorActual.current = controlador;

    setCargando(true);

    setVista((anterior) => ({
      ...anterior,
      tipo: 'cargando',
      mensaje: mensajeCarga
    }));

    try {
      const datos = await consulta(controlador.signal);

      if (controlador.signal.aborted) {
        return;
      }

      setVista((anterior) => procesar(datos, anterior));
    } catch (error) {
      if (controlador.signal.aborted) {
        return;
      }

      setVista({
        ...VISTA_INICIAL,
        tipo: 'error',
        mensaje: obtenerMensajeError(error)
      });
    } finally {
      if (!controlador.signal.aborted) {
        setCargando(false);
        controladorActual.current = null;
      }
    }
  }

  function buscar(nombre) {
    const texto = nombre.trim();

    if (!texto) {
      cancelarPeticion();

      setVista({
        ...VISTA_INICIAL,
        tipo: 'aviso',
        mensaje: 'Escribe el nombre de un cóctel para buscar'
      });

      return;
    }

    ejecutarPeticion(
      (signal) => obtenerCocktails(texto, signal),
      'Buscando cócteles...',
      (datos) => {
        const cocktails = ordenarCocktails(datos.drinks || []);

        return {
          tipo: 'lista',
          cocktails,
          detalle: null,
          origen: 'lista',
          mensaje: obtenerMensajeResultados(cocktails.length, texto),
          incluirRecuento: true
        };
      }
    );
  }


    function filtrar(categoria, ingrediente) {
    const textoIngrediente = ingrediente.trim();

    if (!categoria && !textoIngrediente) {
        cancelarPeticion();

        setVista({
        ...VISTA_INICIAL,
        tipo: 'aviso',
        mensaje: 'Selecciona una categoría o escribe un ingrediente'
        });

        return;
    }

    ejecutarPeticion(
        async (signal) => {
        // Obtener todos los cócteles que coincidan con los filtros.
        const [respuestaCategoria, respuestaIngrediente] =
            await Promise.all([
            categoria
                ? obtenerCocktailsCategoria(categoria, signal)
                : Promise.resolve(null),

            textoIngrediente
                ? obtenerCocktailsIngrediente(textoIngrediente, signal)
                : Promise.resolve(null)
            ]);

        const cocktailsCategoria = respuestaCategoria?.drinks || [];
        const cocktailsIngrediente = respuestaIngrediente?.drinks || [];

        let resultados;

        if (categoria && textoIngrediente) {
            // Intersección: deben cumplir los dos filtros.
            const idsCategoria = new Set(
            cocktailsCategoria.map((cocktail) => cocktail.idDrink)
            );

            resultados = cocktailsIngrediente.filter((cocktail) =>
            idsCategoria.has(cocktail.idDrink)
            );
        } else if (categoria) {
            resultados = cocktailsCategoria;
        } else {
            resultados = cocktailsIngrediente;
        }

        // Consultar la ficha completa de cada resultado.
        const detalles = await Promise.all(
            resultados.map((cocktail) =>
            obtenerDetalleCocktail(cocktail.idDrink, signal)
            )
        );


        return detalles
            .map((respuesta) => respuesta.drinks?.[0])
            .filter(Boolean);
        },
        'Aplicando filtros...',
        (datos) => {
        const cocktails = ordenarCocktails(datos);

        let mensaje;

        if (categoria && textoIngrediente) {
            mensaje =
            `Cócteles de ${categoria} con ${textoIngrediente}: ` +
            cocktails.length;
        } else if (categoria) {
            mensaje = obtenerMensajeCategoria(
            categoria,
            cocktails.length
            );
        } else {
            mensaje =
            `Cócteles con ${textoIngrediente}: ${cocktails.length}`;
        }

        return {
            tipo: 'lista',
            cocktails,
            detalle: null,
            origen: 'lista',
            mensaje,
            incluirRecuento: false
        };
        }
    );
    }


  function aleatorio() {
    ejecutarPeticion(
      (signal) => obtenerCocktailAleatorio(signal),
      'Buscando una sorpresa...',
      (datos) => {
        const cocktail = datos.drinks?.[0];
        const cocktails = cocktail ? [cocktail] : [];

        return {
          tipo: 'lista',
          cocktails,
          detalle: null,
          origen: 'lista',
          mensaje: cocktail
            ? '¡Aquí tienes un cóctel sorpresa!'
            : 'No se ha encontrado ningún cóctel',
          incluirRecuento: false
        };
      }
    );
  }

  function verDetalle(id) {
    ejecutarPeticion(
      (signal) => obtenerDetalleCocktail(id, signal),
      'Cargando receta...',
      (datos, anterior) => {
        const detalle = datos.drinks?.[0] || null;

        return {
          ...anterior,
          tipo: detalle ? 'detalle' : anterior.origen,
          detalle,
          mensaje: detalle
            ? 'Detalle del cóctel'
            : 'No se ha encontrado la receta'
        };
      }
    );
  }

  function mostrarFavoritos(ids) {
    cancelarPeticion();

    if (ids.length === 0) {
      setVista({
        ...VISTA_INICIAL,
        tipo: 'favoritos',
        origen: 'favoritos',
        mensaje: 'No tienes favoritos todavía'
      });

      return;
    }

    ejecutarPeticion(
      async (signal) => {
        const respuestas = await Promise.all(
          ids.map((id) => obtenerDetalleCocktail(id, signal))
        );

        return respuestas
          .map((respuesta) => respuesta.drinks?.[0])
          .filter(Boolean);
      },
      'Cargando favoritos...',
      (datos) => ({
        tipo: 'favoritos',
        cocktails: ordenarCocktails(datos),
        detalle: null,
        origen: 'favoritos',
        mensaje: `Mis favoritos: ${datos.length}`,
        incluirRecuento: false
      })
    );
  }

  function volver() {
    cancelarPeticion();

    setVista((anterior) => {
      const tipo = anterior.origen === 'favoritos'
        ? 'favoritos'
        : 'lista';

      return {
        ...anterior,
        tipo,
        detalle: null,
        mensaje: tipo === 'favoritos'
          ? 'Mis favoritos'
          : 'Estos son tus resultados'
      };
    });
  }

  return {
    vista,
    cargando,
    buscar,
    filtrar,
    aleatorio,
    verDetalle,
    mostrarFavoritos,
    volver
  };
}
