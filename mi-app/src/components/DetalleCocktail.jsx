
import { useState } from 'react';

export default function DetalleCocktail({ cocktail, onVolver }) {
  const [errorImagen, setErrorImagen] = useState(false);

  const ingredientes = Array.from({ length: 15 }, (_, indice) => {
    const numero = indice + 1;

    return {
      numero,
      nombre: cocktail[`strIngredient${numero}`],
      cantidad: cocktail[`strMeasure${numero}`]
    };
  })
    .filter((ingrediente) => {
      return (
        typeof ingrediente.nombre === 'string' &&
        ingrediente.nombre.trim() !== ''
      );
    })
    .map((ingrediente) => {
      const cantidad = ingrediente.cantidad?.trim();

      return {
        numero: ingrediente.numero,
        texto: cantidad
          ? `${ingrediente.nombre.trim()}: ${cantidad}`
          : ingrediente.nombre.trim()
      };
    });

  return (
    <article className="detalle-cocktail">
      <h2>{cocktail.strDrink}</h2>

      {cocktail.strDrinkThumb && !errorImagen && (
        <img
          src={cocktail.strDrinkThumb}
          alt={`Imagen de ${cocktail.strDrink}`}
          loading="lazy"
          onError={() => setErrorImagen(true)}
        />
      )}

      <p>
        Categoría: {cocktail.strCategory || 'No especificada'}
      </p>

      <p>
        Vaso: {cocktail.strGlass || 'No especificado'}
      </p>

      <h3>Ingredientes</h3>

      <ul>
        {ingredientes.length === 0 ? (
          <li>No hay ingredientes disponibles</li>
        ) : (
          ingredientes.map((ingrediente) => (
            <li key={ingrediente.numero}>
              {ingrediente.texto}
            </li>
          ))
        )}
      </ul>

      <h3>Preparación</h3>

      <p>
        {cocktail.strInstructions ||
          'No hay instrucciones disponibles'}
      </p>

      <button type="button" onClick={onVolver}>
        Volver a los resultados
      </button>
    </article>
  );
}
