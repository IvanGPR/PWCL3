
export default function FiltroIngredientes({
  ingrediente,
  onCambiar,
  cargando
}) {
  return (
    <div className="campo-ingrediente">
      <label htmlFor="ingrediente">
        Ingrediente:
      </label>

      <input
        type="text"
        id="ingrediente"
        value={ingrediente}
        onChange={(evento) => onCambiar(evento.target.value)}
        placeholder="Ej.: Vodka, Rum, Lime"
        disabled={cargando}
      />
    </div>
  );
}
