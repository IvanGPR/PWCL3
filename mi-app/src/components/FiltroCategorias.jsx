
export default function FiltroCategorias({
  categorias,
  categoria,
  onCambiar,
  estado,
  error,
  onReintentar,
  cargando
}) {
  return (
    <section id="filtroCategorias">
      <label htmlFor="selectorCategorias">
        Filtrar por categoria:
      </label>

      <select
        id="selectorCategorias"
        value={categoria}
        onChange={(evento) => onCambiar(evento.target.value)}
        disabled={cargando}
      >
        <option value="">Selecciona una categoria</option>

        {categorias.map((nombre) => (
          <option key={nombre} value={nombre}>
            {nombre}
          </option>
        ))}
      </select>

      <div id="estadoCategorias" role="status">
        {estado === 'cargando' && 'Cargando categorias...'}
        {error && error}
      </div>

      {error && (
        <button
          type="button"
          id="reintentarCategorias"
          onClick={onReintentar}
        >
          Reintentar carga de categorias
        </button>
      )}
    </section>
  );
}
