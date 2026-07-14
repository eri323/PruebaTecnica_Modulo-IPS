// Frontend/src/components/dashboard/BarraDistribucion.jsx
// Distribución de estados en CSS puro: se calcula sobre los conteos que ya devuelve el endpoint,
// sin sumar una librería de gráficos por una sola barra.
const SEGMENTOS = [
  { clave: 'pendientes', texto: 'Pendiente', color: 'bg-amber-400' },
  { clave: 'en_atencion', texto: 'En atención', color: 'bg-blue-500' },
  { clave: 'atendidos', texto: 'Atendido', color: 'bg-green-500' },
];

export default function BarraDistribucion({ indicadores }) {
  const total = indicadores.registrados;

  // Sin pacientes no hay distribución que mostrar; dividir por cero daría NaN%.
  if (total === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-medium text-slate-700">Distribución por estado</h2>
        <p className="mt-3 text-sm text-slate-500">No hay pacientes registrados.</p>
      </div>
    );
  }

  const partes = SEGMENTOS.map((segmento) => {
    const cantidad = indicadores[segmento.clave];
    return { ...segmento, cantidad, porcentaje: (cantidad / total) * 100 };
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-medium text-slate-700">Distribución por estado</h2>

      <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
        {partes.map((parte) => (
          <div
            key={parte.clave}
            className={parte.color}
            style={{ width: `${parte.porcentaje}%` }}
            title={`${parte.texto}: ${parte.cantidad}`}
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {partes.map((parte) => (
          <li key={parte.clave} className="flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${parte.color}`} />
            <span className="text-slate-600">{parte.texto}</span>
            <span className="font-medium text-slate-800">
              {parte.cantidad.toLocaleString('es-CO')} ({parte.porcentaje.toFixed(1)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
