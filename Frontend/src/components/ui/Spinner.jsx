// Frontend/src/components/ui/Spinner.jsx
// Indicador de carga para bloques pequeños (el listado usa skeleton, no spinner).
export default function Spinner({ className = 'h-6 w-6' }) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={`inline-block animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 ${className}`}
    />
  );
}
