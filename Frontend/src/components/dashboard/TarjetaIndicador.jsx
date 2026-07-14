// Frontend/src/components/dashboard/TarjetaIndicador.jsx
// Tarjeta de un indicador. Muestra un skeleton en vez del número mientras carga,
// para que el layout no salte cuando llegan los datos.
const ACENTOS = {
  slate: 'bg-slate-100 text-slate-600',
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
};

export default function TarjetaIndicador({ titulo, valor, icono, acento = 'slate', cargando = false }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-500">{titulo}</p>
          {cargando ? (
            <div className="mt-2 h-8 w-16 animate-pulse rounded bg-slate-200" />
          ) : (
            <p className="mt-1 text-3xl font-semibold text-slate-800">{valor.toLocaleString('es-CO')}</p>
          )}
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${ACENTOS[acento]}`}>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={icono} />
          </svg>
        </span>
      </div>
    </div>
  );
}
