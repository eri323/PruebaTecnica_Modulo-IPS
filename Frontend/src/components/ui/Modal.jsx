// Frontend/src/components/ui/Modal.jsx
// Modal genérico: cierra con Escape o clic en el fondo y bloquea el scroll de la página detrás.
import { useEffect } from 'react';

export default function Modal({ abierto, titulo, onCerrar, children }) {
  useEffect(() => {
    if (!abierto) return;

    function alPresionarTecla(evento) {
      if (evento.key === 'Escape') onCerrar();
    }

    document.addEventListener('keydown', alPresionarTecla);
    // Sin esto, el fondo sigue desplazándose con la rueda del ratón mientras el modal está abierto.
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', alPresionarTecla);
      document.body.style.overflow = '';
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 sm:items-center"
      onClick={onCerrar}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="w-full max-w-2xl rounded-xl bg-white shadow-xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">{titulo}</h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
