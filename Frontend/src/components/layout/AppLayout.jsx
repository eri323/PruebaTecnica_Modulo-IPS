// Frontend/src/components/layout/AppLayout.jsx
// Shell de las pantallas autenticadas: sidebar + topbar + contenido de la ruta activa.
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/useAuth';

export default function AppLayout() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const { usuario, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar abierto={sidebarAbierto} onCerrar={() => setSidebarAbierto(false)} />

      {/* El margen izquierdo solo aplica en escritorio: en móvil el sidebar flota sobre el contenido. */}
      <div className="md:ml-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarAbierto(true)}
            aria-label="Abrir menú"
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">{usuario?.nombre}</p>
              <p className="text-xs text-slate-500">{usuario?.rol}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Salir
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
