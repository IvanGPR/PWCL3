
import { useState } from 'react';

export default function TarjetaCocktail({
  cocktail,
  onDetalle,
  onFavorito,
  esFavorito
}) {
  const [errorImagen, setErrorImagen] = useState(false);

  return (
    <article className="tarjeta-cocktail">
      <h2>{cocktail.strDrink}</h2>

      {cocktail.strDrinkThumb && !errorImagen && (
        <img
          src={cocktail.strDrinkThumb}
          alt={`Imagen de ${cocktail.strDrink}`}
          loading="lazy"
          onError={() => setErrorImagen(true)}
        />
      )}

      <p className="categoria-cocktail">
        {cocktail.strCategory || 'Categoría no disponible'}
      </p>

      <button
        type="button"
        onClick={() => onDetalle(cocktail.idDrink)}
      >
        Ver receta
      </button>

      <button
        type="button"
        className="boton-favorito"
        onClick={() => onFavorito(cocktail)}
      >
        {esFavorito ? 'Quitar favorito' : 'Añadir favorito'}
      </button>
    </article>
  );
}
