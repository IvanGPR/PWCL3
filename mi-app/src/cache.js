
const DURACION_CACHE = 30 * 60 * 1000;
const PREFIJO_CACHE = 'cocktailWiki:';

export function obtenerCache(clave) {
  const claveCache = `${PREFIJO_CACHE}${clave}`;

  try {
    const contenido = localStorage.getItem(claveCache);

    if (!contenido) {
      return null;
    }

    const datosGuardados = JSON.parse(contenido);

    if (
      !datosGuardados ||
      typeof datosGuardados.timestamp !== 'number' ||
      !Number.isFinite(datosGuardados.timestamp) ||
      !datosGuardados.datos ||
      typeof datosGuardados.datos !== 'object'
    ) {
      localStorage.removeItem(claveCache);
      return null;
    }

    const cacheCaducada =
      Date.now() - datosGuardados.timestamp > DURACION_CACHE;

    if (cacheCaducada) {
      localStorage.removeItem(claveCache);
      return null;
    }

    return datosGuardados.datos;
  } catch {
    return null;
  }
}

export function guardarCache(clave, datos) {
  const claveCache = `${PREFIJO_CACHE}${clave}`;

  try {
    const contenido = {
      timestamp: Date.now(),
      datos: datos
    };

    localStorage.setItem(claveCache, JSON.stringify(contenido));
  } catch {
    console.warn('No se han podido guardar los datos en la cache');
  }
}
