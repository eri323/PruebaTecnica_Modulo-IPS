// Frontend/src/components/ui/Boton.jsx
// Botón único de la app: centraliza variantes y estado de carga para no repetir clases de Tailwind.
const VARIANTES = {
  primario: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secundario: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-400',
  peligro: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  texto: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400',
};

export default function Boton({
  children,
  variante = 'primario',
  tipo = 'button',
  cargando = false,
  disabled = false,
  className = '',
  ...resto
}) {
  return (
    <button
      type={tipo}
      disabled={disabled || cargando}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTES[variante]} ${className}`}
      {...resto}
    >
      {cargando && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
