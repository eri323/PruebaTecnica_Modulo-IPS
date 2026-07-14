// Frontend/src/components/pacientes/TablaPacientes.jsx
// Tabla en escritorio y tarjetas apiladas en móvil: una tabla de 8 columnas es ilegible en un teléfono.
// Mientras carga muestra filas skeleton, para que el contenido no salte al llegar los datos.
import Badge from '../ui/Badge';

const COLUMNAS = ['Documento', 'Nombre', 'EPS', 'Ciudad', 'Prioridad', 'Estado', ''];

function Acciones({ paciente, onEditar, onEliminar }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onEditar(paciente)}
        className="rounded-md px-2 py-1 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
      >
        Editar
      </button>
      <button
        type="button"
        onClick={() => onEliminar(paciente)}
        className="rounded-md px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        Eliminar
      </button>
    </div>
  );
}

function FilasSkeleton() {
  return Array.from({ length: 5 }, (_, i) => (
    <tr key={i} className="border-t border-slate-100">
      {COLUMNAS.map((_columna, j) => (
        <td key={j} className="px-4 py-3">
          <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        </td>
      ))}
    </tr>
  ));
}

export default function TablaPacientes({ pacientes, cargando, onEditar, onEliminar }) {
  return (
    <>
      {/* Escritorio */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {COLUMNAS.map((columna, i) => (
                <th key={i} scope="col" className="whitespace-nowrap px-4 py-3 font-medium">
                  {columna}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <FilasSkeleton />
            ) : (
              pacientes.map((paciente) => (
                <tr key={paciente.paciente_id} className="border-t border-slate-100 transition hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {paciente.tipo_documento} {paciente.documento}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{paciente.nombre_completo}</td>
                  <td className="px-4 py-3 text-slate-600">{paciente.eps_nombre}</td>
                  <td className="px-4 py-3 text-slate-600">{paciente.ciudad || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge tipo="prioridad" valor={paciente.prioridad} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge tipo="estado" valor={paciente.estado} />
                  </td>
                  <td className="px-4 py-3">
                    <Acciones paciente={paciente} onEditar={onEditar} onEliminar={onEliminar} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Móvil */}
      <div className="space-y-3 md:hidden">
        {cargando
          ? Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" />
            ))
          : pacientes.map((paciente) => (
              <div key={paciente.paciente_id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">{paciente.nombre_completo}</p>
                    <p className="text-sm text-slate-500">
                      {paciente.tipo_documento} {paciente.documento}
                    </p>
                  </div>
                  <Badge tipo="prioridad" valor={paciente.prioridad} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <Badge tipo="estado" valor={paciente.estado} />
                  <span>· {paciente.eps_nombre}</span>
                  {paciente.ciudad && <span>· {paciente.ciudad}</span>}
                </div>

                <div className="mt-3 border-t border-slate-100 pt-2">
                  <Acciones paciente={paciente} onEditar={onEditar} onEliminar={onEliminar} />
                </div>
              </div>
            ))}
      </div>
    </>
  );
}
