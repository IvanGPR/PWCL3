
import { obtenerCache, guardarCache } from './cache.js';

const URL_BASE = 'https://www.thecocktaildb.com/api/json/v1/1/';

async function consultarAPI(url, usarCache = true, signal) {
  if (signal?.aborted) {
    throw new DOMException('Petición cancelada', 'AbortError');
  }

  if (usarCache) {
    const datosGuardados = obtenerCache(url);

    if (datosGuardados !== null) {
      return datosGuardados;
    }
  }

  let respuesta;

  try {
    respuesta = await fetch(url, { signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    const errorRed = new Error('No se ha podido conectar con el servidor');
    errorRed.tipo = 'red';
    throw errorRed;
  }

  if (!respuesta.ok) {
    const errorHTTP = new Error('La petición ha fallado');
    errorHTTP.tipo = 'http';
    throw errorHTTP;
  }

  let datos;

  try {
    datos = await respuesta.json();
  } catch {
    const errorDatos = new Error('La respuesta no es un JSON valido');
    errorDatos.tipo = 'datos';
    throw errorDatos;
  }

  if (!datos || typeof datos !== 'object' || !('drinks' in datos) || (datos.drinks !== null && !Array.isArray(datos.drinks))) {
    const errorDatos = new Error('El formato de los datos no es valido');
    errorDatos.tipo = 'datos';
    throw errorDatos;
  }

  if (signal?.aborted) {
    throw new DOMException('Petición cancelada', 'AbortError');
  }

  if (usarCache) {
    guardarCache(url, datos);
  }

  return datos;
}

export function obtenerCocktails(nombre, signal) {
  const url = `${URL_BASE}search.php?s=${encodeURIComponent(nombre)}`;
  return consultarAPI(url, true, signal);
}

export function obtenerCategorias(signal) {
  const url = `${URL_BASE}list.php?c=list`;
  return consultarAPI(url, true, signal);
}

export function obtenerCocktailsCategoria(categoria, signal) {
  const url = `${URL_BASE}filter.php?c=${encodeURIComponent(categoria)}`;
  return consultarAPI(url, true, signal);
}

export function obtenerCocktailsIngrediente(ingrediente, signal) {
  const url = `${URL_BASE}filter.php?i=${encodeURIComponent(ingrediente)}`;
  return consultarAPI(url, true, signal);
}

export function obtenerDetalleCocktail(id, signal) {
  const url = `${URL_BASE}lookup.php?i=${encodeURIComponent(id)}`;
  return consultarAPI(url, true, signal);
}

export function obtenerCocktailAleatorio(signal) {
  const url = `${URL_BASE}random.php`;
  return consultarAPI(url, false, signal);
}
