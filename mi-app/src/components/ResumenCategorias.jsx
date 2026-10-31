
export default function ResumenCategorias({ recuento }) {
  const categorias = Object.entries(recuento);

  if (categorias.length === 0) {
    return null;
  }

  return (
    <section className="resumen-categorias">
      <h2>Resumen por categorias</h2>

      <ul>
        {categorias.map(([categoria, cantidad]) => (
          <li key={categoria}>
            {categoria}: {cantidad}
          </li>
        ))}
      </ul>
    </section>
  );
}
