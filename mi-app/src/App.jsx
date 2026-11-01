
import { useEffect, useRef, useState } from 'react';
import './App.css';

import {
  obtenerCocktails,
  obtenerCategorias,
  obtenerCocktailsCategoria,
  obtenerDetalleCocktail,
  obtenerCocktailAleatorio
} from './api.js';

import {
  obtenerCategoriasValidas,
  ordenarCocktails,
  contarCocktailsPorCategoria,
  obtenerMensajeResultados,
  obtenerMensajeCategoria,
  obtenerMensajeError
} from './logic.js';

import Buscador from './components/Buscador.jsx';
import FiltroCategorias from './components/FiltroCategorias.jsx';
import ListaCocktails from './components/ListaCocktails.jsx';
import DetalleCocktail from './components/DetalleCocktail.jsx';
import ResumenCategorias from './components/ResumenCategorias.jsx';

import localStorage from './hooks/localStorage.js';

export default function App() {
  const [busqueda, setBusqueda] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [estadoCategorias, setEstadoCategorias] = useState('cargando');
  const [errorCategorias, setErrorCategorias] = useState('');
  const [reintento, setReintento] = useState(0);

  const [cocktails, setCocktails] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [incluirRecuento, setIncluirRecuento] = useState(false);

  const [favoritos, setFavoritos] = localStorage('cocktailWiki:favoritos',[]);
  const [verFavoritos, setVerFavoritos] = useState(false);

  const peticionActual = useRef(0);

  // Cargar categorías al montar el componente.
  useEffect(() => {
    const controlador = new AbortController();

    obtenerCategorias(controlador.signal)
      .then((datos) => {
        if (!controlador.signal.aborted) {
          setCategorias(obtenerCategoriasValidas(datos.drinks));
          setEstadoCategorias('completado');
          setErrorCategorias('');
        }
      })
      .catch((error) => {
        if (!controlador.signal.aborted) {
          setEstadoCategorias('error');
          setErrorCategorias(obtenerMensajeError(error));
        }
      });

    return () => controlador.abort();
  }, [reintento]);

  function alternarFavorito(cocktail) {
    setFavoritos((actuales) => {
      const existe = actuales.some(
        (favorito) => favorito.idDrink === cocktail.idDrink
      );

      if (existe) {
        return actuales.filter(
          (favorito) => favorito.idDrink !== cocktail.idDrink
        );
      }

      return [...actuales, cocktail];
    });
  }

  // Función común para gestionar peticiones.
  async function ejecutarPeticion(
    consulta,
    textoCarga,
    procesar,
    conservarFavoritos = false
  ) {
    const numero = ++peticionActual.current;

    setCargando(true);
    setMensaje(textoCarga);
    setDetalle(null);

    if (!conservarFavoritos) {
      setVerFavoritos(false);
    }

    if (textoCarga !== 'Cargando receta...') {
      setCocktails([]);
    }

    try {
      const datos = await consulta();

      if (numero === peticionActual.current) {
        procesar(datos);
      }
    } catch (error) {
      if (numero === peticionActual.current) {
        console.error(error);
        setMensaje(obtenerMensajeError(error));
        setCocktails([]);
      }
    } finally {
      if (numero === peticionActual.current) {
        setCargando(false);
      }
    }
  }

  function mostrarLista(lista, texto, recuento) {
    setCocktails(ordenarCocktails(lista));
    setMensaje(texto);
    setIncluirRecuento(recuento);
  }

  function buscar() {
    const nombre = busqueda.trim();

    if (!nombre) {
      ++peticionActual.current;
      setCargando(false);
      setMensaje('Escribe el nombre de un coctel para buscar');
      setCocktails([]);
      setDetalle(null);
      setVerFavoritos(false);
      return;
    }

    setCategoria('');

    ejecutarPeticion(
      () => obtenerCocktails(nombre),
      'Buscando cocteles...',
      (datos) => {
        const lista = ordenarCocktails(datos.drinks || []);

        mostrarLista(
          lista,
          obtenerMensajeResultados(lista.length, nombre),
          true
        );
      }
    );
  }

  function filtrar(nuevaCategoria) {
    setCategoria(nuevaCategoria);

    if (!nuevaCategoria) {
      ++peticionActual.current;
      setCargando(false);
      setMensaje('Selecciona una categoria para filtrar');
      setCocktails([]);
      setDetalle(null);
      setVerFavoritos(false);
      return;
    }

    ejecutarPeticion(
      () => obtenerCocktailsCategoria(nuevaCategoria),
      'Buscando cocteles de esta categoria...',
      (datos) => {
        const lista = ordenarCocktails(datos.drinks || []);

        mostrarLista(
          lista,
          obtenerMensajeCategoria(nuevaCategoria, lista.length),
          false
        );
      }
    );
  }

  function aleatorio() {
    setCategoria('');

    ejecutarPeticion(
      () => obtenerCocktailAleatorio(),
      'Buscando una sorpresa...',
      (datos) => {
        const cocktail = datos.drinks?.[0];

        mostrarLista(
          cocktail ? [cocktail] : [],
          cocktail
            ? '¡Aquí tienes un coctel sorpresa!'
            : 'No se ha encontrado ningun coctel',
          false
        );
      }
    );
  }

  function verDetalle(id) {
    ejecutarPeticion(
      () => obtenerDetalleCocktail(id),
      'Cargando receta...',
      (datos) => {
        const cocktail = datos.drinks?.[0];

        if (cocktail) {
          setDetalle(cocktail);
          setMensaje('Detalle del coctel');
        } else {
          setMensaje(
            'No se ha encontrado la receta de este coctel'
          );
        }
      },
      verFavoritos
    );
  }

  function volverAResultados() {
    setDetalle(null);

    setMensaje(
      verFavoritos
        ? 'Mis favoritos'
        : 'Estos son tus resultados.'
    );
  }

  function mostrarFavoritos() {
    ++peticionActual.current;

    setCargando(false);
    setDetalle(null);
    setVerFavoritos(true);
    setMensaje(`Mis favoritos: ${favoritos.length}`);
  }

  function reintentarCategorias() {
    setEstadoCategorias('cargando');
    setErrorCategorias('');
    setReintento((numero) => numero + 1);
  }

  // Valores derivados: no necesitan useState.
  const listaVisible = verFavoritos
    ? ordenarCocktails(favoritos)
    : cocktails;

  const recuento =
    incluirRecuento && !verFavoritos
      ? contarCocktailsPorCategoria(cocktails)
      : {};

  return (
    <main id="app">
      <h1 id="cocktails">COCKTAIL WIKI</h1>

      <Buscador
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        onBuscar={buscar}
        onAleatorio={aleatorio}
        cargando={cargando}
      />

      <FiltroCategorias
        categorias={categorias}
        categoria={categoria}
        onCambiar={filtrar}
        estado={estadoCategorias}
        error={errorCategorias}
        onReintentar={reintentarCategorias}
        cargando={cargando}
      />

      <button
        type="button"
        className="boton-favoritos"
        onClick={mostrarFavoritos}
      >
        Mis favoritos ({favoritos.length})
      </button>

      <div
        id="tituloCocktail"
        role="status"
        className={cargando ? 'indicador-carga' : ''}
      >
        {mensaje}
      </div>

      <div id="resultados">
        {detalle ? (
          <DetalleCocktail
            key={detalle.idDrink}
            cocktail={detalle}
            onVolver={volverAResultados}
          />
        ) : (
          <>
            <ListaCocktails
              cocktails={listaVisible}
              onDetalle={verDetalle}
              favoritos={favoritos}
              onFavorito={alternarFavorito}
            />

            {Object.keys(recuento).length > 0 && (
              <ResumenCategorias recuento={recuento} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
