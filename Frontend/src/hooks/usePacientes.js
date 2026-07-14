// Frontend/src/hooks/usePacientes.js
// Estado del listado de pacientes: aplica debounce al buscador, cancela peticiones obsoletas
// y expone un refetch para recargar después de crear, editar o eliminar.
import { useCallback, useEffect, useState } from 'react';
import { listarPacientes } from '../services/pacientes.service';
import { useDebounce } from './useDebounce';

const META_INICIAL = { total: 0, page: 1, limit: 10, totalPages: 0 };

export function usePacientes({ search = '', estado = '', prioridad = '', page = 1, limit = 10 }) {
  const searchRetrasado = useDebounce(search, 400);

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(META_INICIAL);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  // Cambiar este contador vuelve a disparar el efecto sin tocar los filtros.
  const [recarga, setRecarga] = useState(0);

  const refetch = useCallback(() => setRecarga((n) => n + 1), []);

  useEffect(() => {
    // Sin cancelación, teclear rápido produce una carrera: una respuesta vieja puede pisar a la nueva.
    const controlador = new AbortController();

    // eslint-disable-next-line react-hooks/set-state-in-effect -- reinicia el estado de carga al empezar cada fetch, patrón estándar de data fetching
    setCargando(true);
    setError(null);

    const params = { page, limit };
    if (searchRetrasado.trim()) params.search = searchRetrasado.trim();
    if (estado) params.estado = estado;
    if (prioridad) params.prioridad = prioridad;

    listarPacientes(params, controlador.signal)
      .then((respuesta) => {
        setData(respuesta.data);
        setMeta(respuesta.meta);
        setCargando(false);
      })
      .catch((err) => {
        // La cancelación es esperada: no es un error que mostrarle al usuario.
        if (err.code === 'ERR_CANCELED') return;
        setError(err.response?.data?.error || 'No se pudo cargar la lista de pacientes');
        setCargando(false);
      });

    return () => controlador.abort();
  }, [searchRetrasado, estado, prioridad, page, limit, recarga]);

  return { data, meta, cargando, error, refetch };
}
