
import FiltroCategorias from './FiltroCategorias.jsx';
import FiltroIngredientes from './FiltroIngredientes.jsx';

export default function PanelFiltros({
  categorias,
  categoria,
  onCambiarCategoria,
  cargaCategorias,
  ingrediente,
  onCambiarIngrediente,
  onAplicarFiltros,
  cargando
}) {
  return (
    <section className="panel-filtros">
      <h2>Filtrar cócteles</h2>

      <p className="descripcion-filtros">
        Puedes filtrar por categoría, por ingrediente o combinar ambos.
      </p>

      <div className="campos-filtros">
        <FiltroCategorias
          categorias={categorias}
          seleccion={categoria}
          onCambiar={onCambiarCategoria}
          carga={cargaCategorias}
          cargando={cargando}
        />

        <FiltroIngredientes
          ingrediente={ingrediente}
          onCambiar={onCambiarIngrediente}
          cargando={cargando}
        />
      </div>

      <p className="aviso-filtros">
        Selecciona uno o ambos filtros y pulsa el botón para
        mostrar los resultados.
      </p>

      <button
        type="button"
        className="boton-aplicar-filtros"
        onClick={onAplicarFiltros}
        disabled={cargando}
      >
        APLICAR FILTROS
      </button>
    </section>
  );
}
