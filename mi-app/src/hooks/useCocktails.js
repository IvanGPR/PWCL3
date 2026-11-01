
import { useEffect, useRef, useState } from 'react';

import {
  obtenerCocktails,
  // obtenerCategorias,
  obtenerCocktailsCategoria,
  // utilizamos el filtro directo por ingrediente.
  obtenerCocktailsIngrediente,
  obtenerDetalleCocktail,
  obtenerCocktailAleatorio
} from '../api.js';

import {
  ordenarCocktails,
  obtenerMensajeError,
  // contieneIngrediente
} from '../logic.js';

const VISTA_INICIAL = {
  tipo: 'inicio',
  cocktails: [],
  detalle: null,
  origen: 'lista',
  modo: 'busqueda',
  criterio: '',
  filtros: { categoria: '', ingrediente: '' },
  error: ''
};

export default function useCocktails() {
  const [vista, setVista] = useState(VISTA_INICIAL);
  const controladorActual = useRef(null);

  useEffect(() => {
    return () => controladorActual.current?.abort();
  }, []);

  function cancelarPeticion() {
    controladorActual.current?.abort();
    controladorActual.current = null;
  }

  async function ejecutarPeticion(consulta, procesar) {
    cancelarPeticion();

    const controlador = new AbortController();
    controladorActual.current = controlador;

    setVista((anterior) => ({
      ...anterior,
      tipo: 'cargando'
    }));

    try {
      const datos = await consulta(controlador.signal);

      if (!controlador.signal.aborted) {
        setVista((anterior) => procesar(datos, anterior));
      }
    } catch (error) {
      if (!controlador.signal.aborted) {
        setVista({
          ...VISTA_INICIAL,
          tipo: 'error',
          error: obtenerMensajeError(error)
        });
      }
    } finally {
      if (controladorActual.current === controlador) {
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
        // error: 'Escribe el nombre de un coctel para buscar'
        error: 'Escribe el nombre de una comida para buscar'
      });
      return;
    }

    ejecutarPeticion(
      (signal) => obtenerCocktails(texto, signal),
      (datos) => ({
        ...VISTA_INICIAL,
        tipo: 'lista',
        cocktails: ordenarCocktails(datos.drinks || []),
        modo: 'busqueda',
        criterio: texto
      })
    );
  }

  function filtrar(categoria, ingrediente) {
    const texto = ingrediente.trim();

    if (!categoria && !texto) {
      cancelarPeticion();

      setVista({
        ...VISTA_INICIAL,
        tipo: 'aviso',
        error: 'Selecciona una categoria o escribe un ingrediente'
      });

      return;
    }

    ejecutarPeticion(
      async (signal) => {
        let resultados;

        /*
        if (categoria) {
          const respuesta = await obtenerCocktailsCategoria(
            categoria,
            signal
          );

          resultados = respuesta.drinks || [];
        } else {
          const respuesta = await obtenerCategorias(signal);

          const categorias = (respuesta.drinks || [])
            .map((item) => item.strCategory);

          const respuestas = await Promise.all(
            categorias.map((nombre) =>
              obtenerCocktailsCategoria(nombre, signal)
            )
          );

          resultados = respuestas.flatMap(
            (respuesta) => respuesta.drinks || []
          );
        }
        */

        if (categoria && texto) {
          const [respuestaCategoria, respuestaIngrediente] =
            await Promise.all([
              obtenerCocktailsCategoria(categoria, signal),
              obtenerCocktailsIngrediente(texto, signal)
            ]);

          const comidasCategoria = respuestaCategoria.drinks || [];
          const comidasIngrediente = respuestaIngrediente.drinks || [];

          const idsIngrediente = new Set(
            comidasIngrediente.map((comida) => comida.idDrink)
          );

          resultados = comidasCategoria.filter((comida) =>
            idsIngrediente.has(comida.idDrink)
          );

        } else if (categoria) {
          const respuesta = await obtenerCocktailsCategoria(
            categoria,
            signal
          );

          resultados = respuesta.drinks || [];

        } else {
          const respuesta = await obtenerCocktailsIngrediente(
            texto,
            signal
          );

          resultados = respuesta.drinks || [];
        }

        const ids = new Set();

        const cocktailsUnicos = resultados.filter((cocktail) => {
          if (ids.has(cocktail.idDrink)) {
            return false;
          }

          ids.add(cocktail.idDrink);
          return true;
        });

        /*
        const detalles = await Promise.all(
          cocktailsUnicos.map((cocktail) =>
            obtenerDetalleCocktail(cocktail.idDrink, signal)
          )
        );

        const cocktailsCompletos = detalles
          .map((respuesta) => respuesta.drinks?.[0])
          .filter(Boolean);

        if (texto) {
          return cocktailsCompletos.filter((cocktail) =>
            contieneIngrediente(cocktail, texto)
          );
        }

        return cocktailsCompletos;
        */

        return cocktailsUnicos;
      },

      (datos) => ({
        ...VISTA_INICIAL,
        tipo: 'lista',
        cocktails: ordenarCocktails(datos),
        modo: 'filtros',
        origen: 'filtros',
        filtros: {
          categoria,
          ingrediente: texto
        }
      })
    );
  }

  function aleatorio() {
    ejecutarPeticion(
      (signal) => obtenerCocktailAleatorio(signal),
      (datos) => ({
        ...VISTA_INICIAL,
        tipo: 'lista',
        cocktails: datos.drinks || [],
        modo: 'aleatorio',
        origen: 'lista'
      })
    );
  }

  function verDetalle(id) {
    const vistaAnterior = vista.tipo === 'cargando'
      ? VISTA_INICIAL
      : vista;

    ejecutarPeticion(
      (signal) => obtenerDetalleCocktail(id, signal),
      (datos) => {
        const detalle = datos.drinks?.[0] || null;

        if (!detalle) {
          return {
            ...vistaAnterior,
            error: 'No se ha encontrado la receta'
          };
        }

        return {
          ...vistaAnterior,
          tipo: 'detalle',
          detalle
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
        origen: 'favoritos'
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
      (datos) => ({
        ...VISTA_INICIAL,
        tipo: 'favoritos',
        origen: 'favoritos',
        cocktails: ordenarCocktails(datos)
      })
    );
  }

  function volver() {
    cancelarPeticion();

    setVista((anterior) => ({
      ...anterior,
      tipo: anterior.origen,
      detalle: null
    }));
  }

  return {
    vista,
    buscar,
    filtrar,
    aleatorio,
    verDetalle,
    mostrarFavoritos,
    volver
  };
}
