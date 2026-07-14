// Frontend/src/services/pacientes.service.js
// Capa HTTP del CRUD de pacientes: solo habla con la API, no maneja estado.
import api from './api';

// El signal permite cancelar la petición cuando los filtros cambian antes de que responda.
export async function listarPacientes(params, signal) {
  const { data } = await api.get('/patients', { params, signal });
  return data;
}

export async function crearPaciente(paciente) {
  const { data } = await api.post('/patients', paciente);
  return data;
}

export async function actualizarPaciente(id, paciente) {
  const { data } = await api.put(`/patients/${id}`, paciente);
  return data;
}

export async function eliminarPaciente(id) {
  await api.delete(`/patients/${id}`);
}
