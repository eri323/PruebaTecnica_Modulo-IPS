// Frontend/src/components/ui/Campo.jsx
// Input con label y mensaje de error: unifica el layout de todos los formularios.
export default function Campo({
  id,
  label,
  tipo = 'text',
  valor,
  onChange,
  error,
  required = false,
  className = '',
  ...resto
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={tipo}
        value={valor ?? ''}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-md border px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
        }`}
        {...resto}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
