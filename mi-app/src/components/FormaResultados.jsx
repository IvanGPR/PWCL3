
import ListaCocktails from './ListaCocktails.jsx';
import DetalleCocktail from './DetalleCocktail.jsx';
import ResumenCategorias from './ResumenCategorias.jsx';

import {
  contarCocktailsPorCategoria,
  obtenerMensajeVista
} from '../logic.js';

export default function VistaResultados({
  vista,
  favoritosIds,
  onDetalle,
  onFavorito,
  onVolver
}) {
  const cargando = vista.tipo === 'cargando';
  const mensaje = obtenerMensajeVista(vista);

  const mostrarLista =
    vista.tipo === 'lista' || vista.tipo === 'favoritos';

  const recuento =
    vista.tipo === 'lista' && vista.modo === 'busqueda'
      ? contarCocktailsPorCategoria(vista.cocktails)
      : {};

  return (
    <>
      <div
        id="tituloCocktail"
        role="status"
        className={cargando ? 'indicador-carga' : ''}
      >
        {mensaje}
      </div>

      <div id="resultados">
        {vista.tipo === 'detalle' && vista.detalle && (
          <DetalleCocktail
            key={vista.detalle.idDrink}
            cocktail={vista.detalle}
            onVolver={onVolver}
          />
        )}

        {mostrarLista && (
          <ListaCocktails
            cocktails={vista.cocktails}
            onDetalle={onDetalle}
            favoritosIds={favoritosIds}
            onFavorito={onFavorito}
          />
        )}

        {mostrarLista && Object.keys(recuento).length > 0 && (
          <ResumenCategorias recuento={recuento} />
        )}
      </div>
    </>
  );
}
