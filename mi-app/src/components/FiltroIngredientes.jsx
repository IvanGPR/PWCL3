
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

      {/* ANTES: placeholder="Ej.: Vodka, Rum, Lime" */}
      <input
        type="text"
        id="ingrediente"
        value={ingrediente}
        onChange={(evento) => onCambiar(evento.target.value)}
        placeholder="Ej.: Chicken, Rice, Tomato"
        disabled={cargando}
      />
    </div>
  );
}
