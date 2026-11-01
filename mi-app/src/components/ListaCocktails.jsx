
import TarjetaCocktail from './TarjetaCocktail.jsx';

export default function ListaCocktails({
  cocktails,
  onDetalle,
  favoritosIds,
  onFavorito
}) {
  if (cocktails.length === 0) {
    return <p>No hay cócteles para mostrar.</p>;
  }

  return (
    <>
      {cocktails.map((cocktail) => (
        <TarjetaCocktail
          key={cocktail.idDrink}
          cocktail={cocktail}
          onDetalle={onDetalle}
          onFavorito={onFavorito}
          esFavorito={favoritosIds.has(String(cocktail.idDrink))}
        />
      ))}
    </>
  );
}
