// Frontend/src/components/pacientes/ConfirmarBorrado.jsx
// Confirmación antes de eliminar: nombra al paciente explícitamente, porque el borrado es físico
// y no hay forma de deshacerlo.
import { useState } from 'react';
import { eliminarPaciente } from '../../services/pacientes.service';
import Modal from '../ui/Modal';
import Boton from '../ui/Boton';

export default function ConfirmarBorrado({ abierto, paciente, onCerrar, onEliminado }) {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState('');

  async function confirmar() {
    setError('');
    setEliminando(true);
    try {
      await eliminarPaciente(paciente.paciente_id);
      onEliminado('Paciente eliminado correctamente');
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo eliminar el paciente');
    } finally {
      setEliminando(false);
    }
  }

  if (!paciente) return null;

  return (
    <Modal abierto={abierto} titulo="Eliminar paciente" onCerrar={onCerrar}>
      <p className="text-sm text-slate-600">
        ¿Seguro que deseas eliminar a{' '}
        <span className="font-medium text-slate-800">{paciente.nombre_completo}</span> (
        {paciente.tipo_documento} {paciente.documento})? Esta acción no se puede deshacer.
      </p>

      {error && (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Boton variante="secundario" onClick={onCerrar} disabled={eliminando}>
          Cancelar
        </Boton>
        <Boton variante="peligro" onClick={confirmar} cargando={eliminando}>
          Eliminar
        </Boton>
      </div>
    </Modal>
  );
}
