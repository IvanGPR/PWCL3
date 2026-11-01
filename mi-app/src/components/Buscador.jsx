
export default function Buscador({
  busqueda,
  onCambiarBusqueda,
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
        ¿Qué cóctel quieres buscar?
      </label>

      <form onSubmit={manejarEnvio}>
        <input
          type="text"
          id="selecCocktail"
          value={busqueda}
          onChange={(evento) =>
            onCambiarBusqueda(evento.target.value)
          }
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
