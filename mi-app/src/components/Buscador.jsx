
export default function Buscador({
  busqueda,
  setBusqueda,
  onBuscar,
  onAleatorio,
  cargando
}) {
  function manejarEnvio(evento) {
    evento.preventDefault();
    onBuscar();
  }

  return (
    <section id="buscador">
      <label htmlFor="selecCocktail">
        ¿Que coctel quieres buscar?
      </label>

      <form onSubmit={manejarEnvio}>
        <input
          type="text"
          id="selecCocktail"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />

        <button type="submit" disabled={cargando}>
          BUSCAR
        </button>

        <button
          type="button"
          onClick={onAleatorio}
          disabled={cargando}
        >
          SORPRÉNDEME
        </button>
      </form>
    </section>
  );
}
