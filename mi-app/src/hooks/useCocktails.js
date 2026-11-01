
import { useEffect, useRef, useState } from 'react';

import {
  obtenerCocktails,
  obtenerCategorias,
  obtenerCocktailsCategoria,
  obtenerDetalleCocktail,
  obtenerCocktailAleatorio
} from '../api.js';

import {
  ordenarCocktails,
  obtenerMensajeError,
  contieneIngrediente
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

  // Cancela las peticiones pendientes cuando se desmonta el hook.
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
        error: 'Escribe el nombre de un cóctel para buscar'
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
        error: 'Selecciona una categoría o escribe un ingrediente'
      });

      return;
    }

    ejecutarPeticion(
      async (signal) => {
        let resultados;

        if (categoria) {
          // Si hay categoría, solo buscamos en esa categoría.
          const respuesta = await obtenerCocktailsCategoria(
            categoria,
            signal
          );

          resultados = respuesta.drinks || [];
        } else {
          // Si no hay categoría, buscamos en todas las
          // categorías que devuelve la API.
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

        // Eliminar cócteles repetidos por identificador.
        const ids = new Set();

        const cocktailsUnicos = resultados.filter((cocktail) => {
          if (ids.has(cocktail.idDrink)) {
            return false;
          }

          ids.add(cocktail.idDrink);
          return true;
        });

        console.log('Cócteles candidatos:', cocktailsUnicos.length);

        // Recuperar la ficha completa de cada cóctel.
        const detalles = await Promise.all(
          cocktailsUnicos.map((cocktail) =>
            obtenerDetalleCocktail(cocktail.idDrink, signal)
          )
        );

        const cocktailsCompletos = detalles
          .map((respuesta) => respuesta.drinks?.[0])
          .filter(Boolean);

        // Comprobar el ingrediente en cualquiera de
        // las 15 posiciones de cada receta.
        if (texto) {
          return cocktailsCompletos.filter((cocktail) =>
            contieneIngrediente(cocktail, texto)
          );
        }

        return cocktailsCompletos;
      },
      (datos) => ({
        ...VISTA_INICIAL,
        tipo: 'lista',
        cocktails: ordenarCocktails(datos),
        modo: 'filtros',
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
        modo: 'aleatorio'
      })
    );
  }

  function verDetalle(id) {
    // Guardamos la vista anterior para poder regresar.
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
