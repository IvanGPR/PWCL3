
export default function FiltroCategorias({
  categorias,
  seleccion,
  onCambiar,
  estado,
  error,
  onReintentar,
  cargando
}) {
  return (
    <section id="filtroCategorias">
      <label htmlFor="selectorCategorias">
        Filtrar por categoría:
      </label>

      <select
        id="selectorCategorias"
        value={seleccion}
        onChange={(evento) => onCambiar(evento.target.value)}
        disabled={cargando || estado !== 'listo'}
      >
        <option value="">Selecciona una categoría</option>

        {categorias.map((nombre) => (
          <option key={nombre} value={nombre}>
            {nombre}
          </option>
        ))}
      </select>

      <div id="estadoCategorias" role="status">
        {estado === 'cargando' && 'Cargando categorías...'}
        {estado === 'error' && error}
      </div>

      {estado === 'error' && (
        <button
          type="button"
          id="reintentarCategorias"
          onClick={onReintentar}
        >
          Reintentar carga de categorías
        </button>
      )}
    </section>
  );
}
