
import { useState, useEffect } from 'react';

export default function useLocalStorage(clave, valorInicial) {

  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(clave);

      return guardado !== null ? JSON.parse(guardado) : valorInicial;

    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      console.warn('No se han podido guardar los datos');
    }
  }, [clave, valor]);

  return [valor, setValor];
}
