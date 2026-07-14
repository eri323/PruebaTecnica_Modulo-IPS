// Frontend/src/components/ui/Badge.jsx
// Etiqueta de color para estado y prioridad: el color es información, no decoración
// (permite escanear la tabla sin leer cada celda).
const COLORES = {
  estado: {
    'Pendiente': 'bg-amber-100 text-amber-800',
    'En atención': 'bg-blue-100 text-blue-800',
    'Atendido': 'bg-green-100 text-green-800',
  },
  prioridad: {
    'Alta': 'bg-red-100 text-red-800',
    'Media': 'bg-amber-100 text-amber-800',
    'Baja': 'bg-slate-100 text-slate-700',
  },
};

export default function Badge({ tipo, valor }) {
  const color = COLORES[tipo]?.[valor] || 'bg-slate-100 text-slate-700';

  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {valor}
    </span>
  );
}
