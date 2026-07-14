// Frontend/src/hooks/useDebounce.js
// Retrasa la propagación de un valor: evita disparar una petición por cada tecla del buscador.
import { useEffect, useState } from 'react';

export function useDebounce(valor, ms = 400) {
  const [valorRetrasado, setValorRetrasado] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setValorRetrasado(valor), ms);
    return () => clearTimeout(temporizador);
  }, [valor, ms]);

  return valorRetrasado;
}
