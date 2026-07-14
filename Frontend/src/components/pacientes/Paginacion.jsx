// Frontend/src/components/pacientes/Paginacion.jsx
// Paginación mínima: anterior/siguiente y posición actual. No se numeran las páginas
// porque con 1.000 pacientes y 10 por página serían 100 botones.
import Boton from '../ui/Boton';

export default function Paginacion({ meta, onCambiarPagina }) {
  const { page, limit, total, totalPages } = meta;

  if (total === 0) return null;

  const desde = (page - 1) * limit + 1;
  const hasta = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-slate-500">
        Mostrando <span className="font-medium text-slate-700">{desde}</span>–
        <span className="font-medium text-slate-700">{hasta}</span> de{' '}
        <span className="font-medium text-slate-700">{total.toLocaleString('es-CO')}</span> pacientes
      </p>

      <div className="flex items-center gap-2">
        <Boton variante="secundario" disabled={page <= 1} onClick={() => onCambiarPagina(page - 1)}>
          Anterior
        </Boton>
        <span className="px-2 text-sm text-slate-600">
          {page} / {totalPages}
        </span>
        <Boton variante="secundario" disabled={page >= totalPages} onClick={() => onCambiarPagina(page + 1)}>
          Siguiente
        </Boton>
      </div>
    </div>
  );
}
