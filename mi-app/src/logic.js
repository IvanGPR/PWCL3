
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
    // ANTES: return `No se han encontrado cócteles para "${nombre}"`;
    return `No se han encontrado platos para "${nombre}"`;
  }

  if (cantidad === 1) {
    // ANTES: return 'Se ha encontrado 1 cóctel';
    return 'Se ha encontrado 1 plato';
  }

  // ANTES: return `Se han encontrado ${cantidad} cócteles`;
  return `Se han encontrado ${cantidad} platos`;
}

export function obtenerMensajeCategoria(categoria, cantidad) {
  if (cantidad === 0) {
    // ANTES: return `No se han encontrado cócteles en la categoría ${categoria}`;
    return `No se han encontrado platos en la categoría ${categoria}`;
  }

  // ANTES: return `Cócteles de la categoría ${categoria}: ${cantidad}`;
  return `Platos de la categoría ${categoria}: ${cantidad}`;
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
    // ANTES: return 'Busca un cóctel o utiliza los filtros';
    return 'Busca una comida o utiliza los filtros';
  }

  if (vista.tipo === 'cargando') {
    // ANTES: return 'Cargando cócteles...';
    return 'Cargando comidas...';
  }

  if (vista.tipo === 'error' || vista.tipo === 'aviso') {
    return vista.error || '';
  }

  if (vista.tipo === 'detalle') {
    // ANTES: return 'Detalle del cóctel';
    return 'Detalle de la receta';
  }

  if (vista.tipo === 'favoritos') {
    return vista.cocktails.length === 0
      ? 'No tienes favoritos todavía'
      : `Mis favoritos: ${vista.cocktails.length}`;
  }

  if (vista.tipo === 'lista') {
    if (vista.origen === 'aleatorio') {
      return vista.cocktails.length > 0
        // ANTES: '¡Aquí tienes un cóctel sorpresa!'
        ? '¡Aquí tienes una receta sorpresa!'
        // ANTES: 'No se ha encontrado ningún cóctel'
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
        // ANTES: return `Cócteles de ${categoria} con ${ingrediente}: ${vista.cocktails.length}`;
        return `Platos de ${categoria} con ${ingrediente}: ${vista.cocktails.length}`;
      }

      if (categoria) {
        return obtenerMensajeCategoria(
          categoria,
          vista.cocktails.length
        );
      }

      // ANTES: return `Cócteles con ${ingrediente}: ${vista.cocktails.length}`;
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
