// Frontend/src/hooks/useDashboard.js
// Los cinco indicadores operativos; refetch permite reintentar tras un error.
import { useCallback, useEffect, useState } from 'react';
import { obtenerIndicadores } from '../services/dashboard.service';

export function useDashboard() {
  const [indicadores, setIndicadores] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [recarga, setRecarga] = useState(0);

  const refetch = useCallback(() => setRecarga((n) => n + 1), []);

  useEffect(() => {
    let activo = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reinicia el estado de carga al empezar cada fetch, patrón estándar de data fetching
    setCargando(true);
    setError(null);

    obtenerIndicadores()
      .then((datos) => {
        if (!activo) return;
        setIndicadores(datos);
        setCargando(false);
      })
      .catch((err) => {
        if (!activo) return;
        setError(err.response?.data?.error || 'No se pudieron cargar los indicadores');
        setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [recarga]);

  return { indicadores, cargando, error, refetch };
}
