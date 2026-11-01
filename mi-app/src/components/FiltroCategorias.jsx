
export default function FiltroCategorias({
  categorias,
  seleccion,
  onCambiar,
  carga,
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
        disabled={cargando}
      >
        <option value="">Selecciona una categoría</option>

        {categorias.map((nombre) => (
          <option key={nombre} value={nombre}>
            {nombre}
          </option>
        ))}
      </select>

      <div id="estadoCategorias" role="status">
        {carga.estado.tipo === 'cargando' &&
          'Cargando categorías...'}

        {carga.estado.error}
      </div>

      {carga.estado.tipo === 'error' && (
        <button
          type="button"
          onClick={carga.reintentar}
        >
          Reintentar carga de categorías
        </button>
      )}
    </section>
  );
}
