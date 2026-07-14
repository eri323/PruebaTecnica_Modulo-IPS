// Frontend/src/pages/Pacientes.jsx
// Listado de pacientes: filtros, tabla paginada, alta/edición en modal y borrado con confirmación.
import { useState } from 'react';
import { usePacientes } from '../hooks/usePacientes';
import FiltrosPacientes from '../components/pacientes/FiltrosPacientes';
import TablaPacientes from '../components/pacientes/TablaPacientes';
import Paginacion from '../components/pacientes/Paginacion';
import ModalPaciente from '../components/pacientes/ModalPaciente';
import ConfirmarBorrado from '../components/pacientes/ConfirmarBorrado';
import EstadoVacio from '../components/ui/EstadoVacio';
import Boton from '../components/ui/Boton';

const FILTROS_INICIALES = { search: '', estado: '', prioridad: '' };
const POR_PAGINA = 10;

export default function Pacientes() {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [page, setPage] = useState(1);

  // null = modal cerrado; { paciente: null } = crear; { paciente } = editar.
  const [modalPaciente, setModalPaciente] = useState(null);
  const [pacienteABorrar, setPacienteABorrar] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const { data, meta, cargando, error, refetch } = usePacientes({ ...filtros, page, limit: POR_PAGINA });

  // Cualquier cambio de filtro vuelve a la página 1: quedarse en la página 7 de un
  // resultado de 2 páginas devuelve una lista vacía sin explicación aparente.
  function cambiarFiltro(campo, valor) {
    setFiltros((previos) => ({ ...previos, [campo]: valor }));
    setPage(1);
  }

  function limpiarFiltros() {
    setFiltros(FILTROS_INICIALES);
    setPage(1);
  }

  function mostrarMensaje(texto) {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 4000);
  }

  function alGuardar(texto) {
    setModalPaciente(null);
    mostrarMensaje(texto);
    refetch();
  }

  function alEliminar(texto) {
    setPacienteABorrar(null);
    mostrarMensaje(texto);
    // Si se borró el último elemento de la página, retroceder: quedarse ahí mostraría una lista vacía.
    if (data.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      refetch();
    }
  }

  const hayFiltros = Boolean(filtros.search || filtros.estado || filtros.prioridad);
  const sinResultados = !cargando && !error && data.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Pacientes</h1>
          <p className="text-sm text-slate-500">Gestión de pacientes pendientes de atención</p>
        </div>
        <Boton onClick={() => setModalPaciente({ paciente: null })}>Nuevo paciente</Boton>
      </div>

      {mensaje && (
        <p className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">{mensaje}</p>
      )}

      <FiltrosPacientes filtros={filtros} onCambiar={cambiarFiltro} onLimpiar={limpiarFiltros} />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-800">{error}</p>
          <Boton variante="secundario" className="mt-3" onClick={refetch}>
            Reintentar
          </Boton>
        </div>
      ) : sinResultados ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          {hayFiltros ? (
            <EstadoVacio
              titulo="No se encontraron pacientes con esos filtros"
              mensaje="Prueba con otro término de búsqueda o quita los filtros aplicados."
              accion={
                <Boton variante="secundario" onClick={limpiarFiltros}>
                  Limpiar filtros
                </Boton>
              }
            />
          ) : (
            <EstadoVacio
              titulo="Aún no hay pacientes registrados"
              mensaje="Crea el primer paciente para empezar a hacerle seguimiento."
              accion={<Boton onClick={() => setModalPaciente({ paciente: null })}>Nuevo paciente</Boton>}
            />
          )}
        </div>
      ) : (
        <>
          <TablaPacientes
            pacientes={data}
            cargando={cargando}
            onEditar={(paciente) => setModalPaciente({ paciente })}
            onEliminar={setPacienteABorrar}
          />
          <Paginacion meta={meta} onCambiarPagina={setPage} />
        </>
      )}

      <ModalPaciente
        abierto={Boolean(modalPaciente)}
        paciente={modalPaciente?.paciente || null}
        onCerrar={() => setModalPaciente(null)}
        onGuardado={alGuardar}
      />

      <ConfirmarBorrado
        abierto={Boolean(pacienteABorrar)}
        paciente={pacienteABorrar}
        onCerrar={() => setPacienteABorrar(null)}
        onEliminado={alEliminar}
      />
    </div>
  );
}
