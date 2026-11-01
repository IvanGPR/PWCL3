
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
    const categoria = cocktail.strCategory || 'Sin categoria';

    recuento[categoria] = (recuento[categoria] || 0) + 1;

    return recuento;
  }, {});
}

export function obtenerMensajeResultados(cantidad, nombre) {
  if (cantidad === 0) {
    // return `No se han encontrado cocteles para "${nombre}"`;
    return `No se han encontrado platos para "${nombre}"`;
  }

  if (cantidad === 1) {
    // return 'Se ha encontrado 1 coctel';
    return 'Se ha encontrado 1 plato';
  }

  // return `Se han encontrado ${cantidad} cocteles`;
  return `Se han encontrado ${cantidad} platos`;
}

export function obtenerMensajeCategoria(categoria, cantidad) {
  if (cantidad === 0) {
    // return `No se han encontrado cocteles en la categoria ${categoria}`;
    return `No se han encontrado platos en la categoria ${categoria}`;
  }

  // return `Cocteles de la categoria ${categoria}: ${cantidad}`;
  return `Platos de la categoria ${categoria}: ${cantidad}`;
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

export function normalizarFavoritos(favoritos) {
  if (!Array.isArray(favoritos)) {
    return [];
  }

  const ids = favoritos
    .map((favorito) => {
      if (favorito && typeof favorito === 'object') {
        return favorito.idDrink;
      }

      return favorito;
    })
    .filter((id) => id !== null && id !== undefined && id !== '')
    .map((id) => String(id));

  return [...new Set(ids)];
}

export function obtenerMensajeVista(vista) {
  if (vista.tipo === 'inicio') {
    // return 'Busca un coctel o utiliza los filtros';
    return 'Busca una comida o utiliza los filtros';
  }

  if (vista.tipo === 'cargando') {
    // return 'Cargando cocteles...';
    return 'Cargando comidas...';
  }

  if (vista.tipo === 'error' || vista.tipo === 'aviso') {
    return vista.error || '';
  }

  if (vista.tipo === 'detalle') {
    // return 'Detalle del cóctel';
    return 'Detalle de la receta';
  }

  if (vista.tipo === 'favoritos') {
    return vista.cocktails.length === 0
      ? 'No tienes favoritos todavia'
      : `Mis favoritos: ${vista.cocktails.length}`;
  }

  if (vista.tipo === 'lista') {
    if (vista.origen === 'aleatorio') {
      return vista.cocktails.length > 0
        // '¡Aqui tienes un cóctel sorpresa!'
        ? '¡Aqui tienes una receta sorpresa!'
        // 'No se ha encontrado ningún cóctel'
        : 'No se ha encontrado ninguna receta';
    }

    if (vista.origen === 'busqueda') {
      return obtenerMensajeResultados(
        vista.cocktails.length,
        vista.criterio
      );
    }

    if (vista.origen === 'filtros') {
      const { categoria, ingrediente } = vista.filtros;

      if (categoria && ingrediente) {
        // return `Cocteles de ${categoria} con ${ingrediente}: ${vista.cocktails.length}`;
        return `Platos de ${categoria} con ${ingrediente}: ${vista.cocktails.length}`;
      }

      if (categoria) {
        return obtenerMensajeCategoria(
          categoria,
          vista.cocktails.length
        );
      }

      // return `Cocteles con ${ingrediente}: ${vista.cocktails.length}`;
      return `Platos con ${ingrediente}: ${vista.cocktails.length}`;
    }
  }

  return '';
}

export function contieneIngrediente(cocktail, ingrediente) {
  const buscado = ingrediente.trim().toLowerCase();

  for (let i = 1; i <= 15; i++) {
    const actual = cocktail[`strIngredient${i}`];

    if (actual && actual.toLowerCase() === buscado) {
      return true;
    }
  }

  return false;
}
