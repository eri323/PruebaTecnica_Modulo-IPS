// Frontend/src/components/ui/Select.jsx
// Select con label y error; las opciones llegan como [{ valor, texto }].
export default function Select({
  id,
  label,
  valor,
  onChange,
  opciones = [],
  placeholder = 'Seleccione...',
  error,
  required = false,
  className = '',
  ...resto
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </label>
      )}
      <select
        id={id}
        name={id}
        value={valor ?? ''}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-md border bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
        }`}
        {...resto}
      >
        <option value="">{placeholder}</option>
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.texto}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
