// Frontend/src/services/eps.service.js
// Catálogo de EPS para poblar el select del formulario.
import api from './api';

export async function listarEps() {
  const { data } = await api.get('/eps');
  return data;
}
