
import { useState } from 'react';
import './App.css';

import useCocktails from './hooks/useCocktails.js';
import useCategorias from './hooks/useCategorias.js';
import useLocalStorage from './hooks/useLocalStorage.js';

import { normalizarFavoritos } from './logic.js';

import Buscador from './components/Buscador.jsx';
import PanelFiltrar from './components/PanelFiltrar.jsx';
import FormaResultados from './components/FormaResultados.jsx';

export default function App() {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ingrediente, setIngrediente] = useState('');

  const [favoritos, setFavoritos] = useLocalStorage(
    'cocktailWiki:favoritos',
    [],
    normalizarFavoritos
  );

  const cargaCategorias = useCategorias();

  const {
    vista,
    buscar,
    filtrar,
    aleatorio,
    verDetalle,
    mostrarFavoritos,
    volver
  } = useCocktails();

  // Estado derivado: no necesita otro useState.
  const cargando = vista.tipo === 'cargando';
  const favoritosSet = new Set(favoritos);

  function alternarFavorito(cocktail) {
    const id = String(cocktail.idDrink);

    setFavoritos((anteriores) => {
      if (anteriores.includes(id)) {
        return anteriores.filter((actual) => actual !== id);
      }

      return [...anteriores, id];
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

      <PanelFiltrar
        categorias={cargaCategorias.categorias}
        categoria={categoria}
        onCambiarCategoria={setCategoria}
        estadoCategorias={cargaCategorias.estado.tipo}
        errorCategorias={cargaCategorias.estado.error}
        onReintentarCategorias={cargaCategorias.reintentar}
        ingrediente={ingrediente}
        onCambiarIngrediente={setIngrediente}
        onAplicarFiltros={aplicarFiltros}
        cargando={cargando}
      />

      <button
        type="button"
        className="boton-favoritos"
        onClick={() => mostrarFavoritos(favoritos)}
      >
        Mis favoritos ({favoritos.length})
      </button>

      <FormaResultados
        vista={vista}
        favoritosIds={favoritosSet}
        onDetalle={verDetalle}
        onFavorito={alternarFavorito}
        onVolver={volver}
      />
    </main>
  );
}
