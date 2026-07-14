// Frontend/src/services/dashboard.service.js
// Indicadores operativos del dashboard.
import api from './api';

export async function obtenerIndicadores() {
  const { data } = await api.get('/dashboard');
  return data;
}
