
import TarjetaCocktail from './TarjetaCocktail.jsx';

export default function ListaCocktails({
  cocktails,
  onDetalle,
  favoritos,
  onFavorito
}) {
  if (cocktails.length === 0) {
    return <p>No hay cocteles para mostrar</p>;
  }

  return (
    <>
      {cocktails.map((cocktail) => (
        <TarjetaCocktail
          key={cocktail.idDrink}
          cocktail={cocktail}
          onDetalle={onDetalle}
          onFavorito={onFavorito}
          esFavorito={favoritos.some(
            (favorito) => favorito.idDrink === cocktail.idDrink
          )}
        />
      ))}
    </>
  );
}
