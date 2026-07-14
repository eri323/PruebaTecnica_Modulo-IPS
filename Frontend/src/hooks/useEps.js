// Frontend/src/hooks/useEps.js
// Catálogo de EPS: se carga una sola vez al montar; alimenta el select del formulario.
import { useEffect, useState } from 'react';
import { listarEps } from '../services/eps.service';

export function useEps() {
  const [eps, setEps] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    listarEps()
      .then((datos) => {
        if (!activo) return;
        setEps(datos);
        setCargando(false);
      })
      .catch((err) => {
        if (!activo) return;
        setError(err.response?.data?.error || 'No se pudo cargar el catálogo de EPS');
        setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  return { eps, cargando, error };
}
