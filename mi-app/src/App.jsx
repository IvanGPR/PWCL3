
import { useState } from 'react';
import './App.css';

import useCocktails from './hooks/cocktails.js';
import useCategorias from './hooks/categorias.js';
import useLocalStorage from './hooks/localStorage.js';

import { contarCocktailsPorCategoria } from './logic.js';

import Buscador from './components/Buscador.jsx';
import FiltroCategorias from './components/FiltroCategorias.jsx';
import FiltroIngredientes from './components/FiltroIngredientes.jsx';
import ListaCocktails from './components/ListaCocktails.jsx';
import DetalleCocktail from './components/DetalleCocktail.jsx';
import ResumenCategorias from './components/ResumenCategorias.jsx';

export default function App() {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ingrediente, setIngrediente] = useState('');

  const [favoritos, setFavoritos] = useLocalStorage(
    'cocktailWiki:favoritos',
    []
  );

  const cargaCategorias = useCategorias();

  const {
    vista,
    cargando,
    buscar,
    filtrar,
    aleatorio,
    verDetalle,
    mostrarFavoritos,
    volver
  } = useCocktails();

  // Acepta tanto favoritos antiguos (objetos)
  // como favoritos nuevos (identificadores).
  const idsFavoritos = Array.isArray(favoritos)
    ? favoritos.map((favorito) =>
        String(
          typeof favorito === 'object'
            ? favorito.idDrink
            : favorito
        )
      )
    : [];

  const favoritosSet = new Set(idsFavoritos);

  function alternarFavorito(cocktail) {
    const id = String(cocktail.idDrink);

    setFavoritos((anteriores) => {
      const ids = Array.isArray(anteriores)
        ? anteriores.map((favorito) =>
            String(
              typeof favorito === 'object'
                ? favorito.idDrink
                : favorito
            )
          )
        : [];

      if (ids.includes(id)) {
        return ids.filter((actual) => actual !== id);
      }

      return [...ids, id];
    });
  }

  function buscarNombre() {
    setCategoria('');
    setIngrediente('');
    buscar(busqueda);
  }

  function buscarAleatorio() {
    setCategoria('');
    setIngrediente('');
    aleatorio();
  }

  function aplicarFiltros() {
    filtrar(categoria, ingrediente);
  }

  const recuento = vista.incluirRecuento
    ? contarCocktailsPorCategoria(vista.cocktails)
    : {};

  return (
    <main id="app">
      <h1 id="cocktails">COCKTAIL WIKI</h1>

      <Buscador
        busqueda={busqueda}
        onCambiarBusqueda={setBusqueda}
        onBuscar={buscarNombre}
        onAleatorio={buscarAleatorio}
        cargando={cargando}
      />

      <FiltroCategorias
        categorias={cargaCategorias.categorias}
        seleccion={categoria}
        onCambiar={setCategoria}
        carga={cargaCategorias}
        cargando={cargando}
      />

      <FiltroIngredientes
        ingrediente={ingrediente}
        onCambiar={setIngrediente}
        onFiltrar={aplicarFiltros}
        cargando={cargando}
      />

      <button
        type="button"
        className="boton-favoritos"
        onClick={() => mostrarFavoritos(idsFavoritos)}
      >
        ★ Mis favoritos ({idsFavoritos.length})
      </button>

      <div
        id="tituloCocktail"
        role="status"
        className={cargando ? 'indicador-carga' : ''}
      >
        {vista.mensaje}
      </div>

      <div id="resultados">
        {vista.tipo === 'detalle' && vista.detalle ? (
          <DetalleCocktail
            key={vista.detalle.idDrink}
            cocktail={vista.detalle}
            onVolver={volver}
          />
        ) : (
          <>
            {(vista.tipo === 'lista' ||
              vista.tipo === 'favoritos') && (
              <ListaCocktails
                cocktails={vista.cocktails}
                onDetalle={verDetalle}
                favoritosIds={favoritosSet}
                onFavorito={alternarFavorito}
              />
            )}

            {vista.tipo === 'lista' &&
              Object.keys(recuento).length > 0 && (
                <ResumenCategorias recuento={recuento} />
              )}
          </>
        )}
      </div>
    </main>
  );
}
