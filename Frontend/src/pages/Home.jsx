// Frontend/src/pages/Home.jsx
// Placeholder de la pantalla principal (protegida); el dashboard real llega en fases posteriores.
import { useAuth } from '../context/useAuth';

export default function Home() {
  const { usuario, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              Bienvenido, {usuario?.nombre}
            </h1>
            <p className="text-sm text-slate-500">Rol: {usuario?.rol}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
