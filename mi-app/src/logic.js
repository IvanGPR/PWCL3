
export function obtenerCategoriasValidas(datos) {
  if (!Array.isArray(datos)) {
    return [];
  }

  return datos
    .filter((categoria) => {
      return categoria &&
        typeof categoria.strCategory === 'string';
    })
    .map((categoria) => categoria.strCategory)
    .filter((categoria) => categoria.trim() !== '');
}

export function ordenarCocktails(cocktails) {
  if (!Array.isArray(cocktails)) {
    return [];
  }

  const cocktailsValidos = cocktails.filter((cocktail) => {
    return (
      cocktail &&
      typeof cocktail.strDrink === 'string' &&
      cocktail.strDrink.trim() !== ''
    );
  });

  return cocktailsValidos.toSorted((a, b) => {
    return a.strDrink.localeCompare(b.strDrink, 'en');
  });
}

export function contarCocktailsPorCategoria(cocktails) {
  if (!Array.isArray(cocktails)) {
    return {};
  }

  return cocktails.reduce((recuento, cocktail) => {
    const categoria = cocktail.strCategory || 'Sin categoria';

    if (!recuento[categoria]) {
      recuento[categoria] = 0;
    }

    recuento[categoria]++;

    return recuento;
  }, {});
}

export function obtenerMensajeResultados(cantidad, nombre) {
  if (cantidad === 0) {
    return `No se han encontrado cocteles para "${nombre}"`;
  }

  if (cantidad === 1) {
    return 'Se ha encontrado 1 coctel';
  }

  return `Se han encontrado ${cantidad} cocteles`;
}

export function obtenerMensajeCategoria(categoria, cantidad) {
  if (cantidad === 0) {
    return `No se han encontrado cocteles en la categoria ${categoria}`;
  }

  return `Cocteles de la categoria ${categoria}: ${cantidad}`;
}

export function obtenerMensajeError(error) {
  if (error.tipo === 'red') {
    return 'Error de conexion. Comprueba tu conexion a Internet.';
  }

  if (error.tipo === 'http') {
    return 'Error del servidor. Intentalo de nuevo.';
  }

  if (error.tipo === 'datos') {
    return 'Los datos recibidos no son validos.';
  }

  return 'Ha ocurrido un error inesperado.';
}
