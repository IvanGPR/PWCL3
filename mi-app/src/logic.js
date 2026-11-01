
export function obtenerCategoriasValidas(datos) {
  if (!Array.isArray(datos)) {
    return [];
  }

  return datos
    .filter((categoria) =>
      typeof categoria?.strCategory === 'string'
    )
    .map((categoria) => categoria.strCategory)
    .filter((nombre) => nombre.trim() !== '');
}

export function ordenarCocktails(cocktails) {
  if (!Array.isArray(cocktails)) {
    return [];
  }

  return cocktails
    .filter((cocktail) =>
      typeof cocktail?.strDrink === 'string'
    )
    .sort((a, b) =>
      a.strDrink.localeCompare(b.strDrink)
    );
}

export function contarCocktailsPorCategoria(cocktails) {
  return cocktails.reduce((recuento, cocktail) => {
    const categoria = cocktail.strCategory || 'Sin categoría';

    recuento[categoria] = (recuento[categoria] || 0) + 1;

    return recuento;
  }, {});
}

export function obtenerMensajeResultados(cantidad, nombre) {
  if (cantidad === 0) {
    return `No se han encontrado cócteles para "${nombre}"`;
  }

  if (cantidad === 1) {
    return 'Se ha encontrado 1 cóctel';
  }

  return `Se han encontrado ${cantidad} cócteles`;
}

export function obtenerMensajeCategoria(categoria, cantidad) {
  if (cantidad === 0) {
    return `No se han encontrado cócteles en la categoría ${categoria}`;
  }

  return `Cócteles de la categoría ${categoria}: ${cantidad}`;
}

export function obtenerMensajeError(error) {
  if (error.tipo === 'red') {
    return 'Error de conexión. Comprueba tu conexión a Internet.';
  }

  if (error.tipo === 'http') {
    return 'Error del servidor. Inténtalo de nuevo.';
  }

  if (error.tipo === 'datos') {
    return 'Los datos recibidos no son válidos.';
  }

  return 'Ha ocurrido un error inesperado.';
}
