
export default function FiltroIngredientes({
  ingrediente,
  onCambiar,
  onFiltrar,
  cargando
}) {
  function manejarEnvio(evento) {
    evento.preventDefault();
    onFiltrar();
  }

  return (
    <section id="filtroIngredientes">
      <label htmlFor="ingrediente">
        Filtrar por ingrediente:
      </label>

      <form onSubmit={manejarEnvio}>
        <input
          type="text"
          id="ingrediente"
          value={ingrediente}
          onChange={(evento) => onCambiar(evento.target.value)}
          placeholder="Ej.: Vodka, Lime, Rum"
        />

        <button type="submit" disabled={cargando}>
          APLICAR FILTROS
        </button>
      </form>
    </section>
  );
}
