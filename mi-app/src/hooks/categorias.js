
import { useEffect, useState } from 'react';
import { obtenerCategorias } from '../api.js';

import {
  obtenerCategoriasValidas,
  obtenerMensajeError
} from '../logic.js';

export default function useCategorias() {
  const [categorias, setCategorias] = useState([]);

  const [estado, setEstado] = useState({
    tipo: 'cargando',
    error: ''
  });

  const [reintento, setReintento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();

    obtenerCategorias(controlador.signal)
      .then((datos) => {
        if (controlador.signal.aborted) {
          return;
        }

        setCategorias(obtenerCategoriasValidas(datos.drinks));

        setEstado({
          tipo: 'listo',
          error: ''
        });
      })
      .catch((error) => {
        if (controlador.signal.aborted) {
          return;
        }

        setEstado({
          tipo: 'error',
          error: obtenerMensajeError(error)
        });
      });

    return () => {
      controlador.abort();
    };
  }, [reintento]);

  function reintentar() {
    setEstado({
      tipo: 'cargando',
      error: ''
    });

    setReintento((anterior) => anterior + 1);
  }

  return {
    categorias,
    estado,
    reintentar
  };
}
