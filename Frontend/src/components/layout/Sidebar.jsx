// Frontend/src/components/layout/Sidebar.jsx
// Navegación principal. En escritorio es una columna fija; en móvil se muestra como drawer
// controlado por AppLayout (por eso recibe abierto/onCerrar en vez de manejarlo aquí).
import { NavLink } from 'react-router-dom';

const ENLACES = [
  {
    a: '/dashboard',
    texto: 'Dashboard',
    icono: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    a: '/pacientes',
    texto: 'Pacientes',
    icono: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  },
];

export default function Sidebar({ abierto, onCerrar }) {
  return (
    <>
      {/* Fondo oscuro que cierra el drawer al tocarlo; solo existe en móvil. */}
      {abierto && (
        <div className="fixed inset-0 z-30 bg-slate-900/50 md:hidden" onClick={onCerrar} role="presentation" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 md:translate-x-0 ${
          abierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
            IPS
          </span>
          <span className="font-semibold text-slate-800">Seguimiento</span>
        </div>

        <nav className="space-y-1 p-4">
          {ENLACES.map((enlace) => (
            <NavLink
              key={enlace.a}
              to={enlace.a}
              onClick={onCerrar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={enlace.icono} />
              </svg>
              {enlace.texto}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
