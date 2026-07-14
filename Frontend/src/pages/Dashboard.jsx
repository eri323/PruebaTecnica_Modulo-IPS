// Frontend/src/pages/Dashboard.jsx
// Vista de indicadores operativos: las 5 tarjetas del enunciado más la distribución por estado.
import { useDashboard } from '../hooks/useDashboard';
import TarjetaIndicador from '../components/dashboard/TarjetaIndicador';
import BarraDistribucion from '../components/dashboard/BarraDistribucion';
import Boton from '../components/ui/Boton';

const ICONOS = {
  registrados: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  pendientes: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  enAtencion: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  atendidos: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  prioridadAlta: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
};

// Valores en cero mientras carga: las tarjetas muestran skeleton, no el número.
const VACIO = { registrados: 0, pendientes: 0, en_atencion: 0, atendidos: 0, prioridad_alta: 0 };

export default function Dashboard() {
  const { indicadores, cargando, error, refetch } = useDashboard();

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-800">{error}</p>
        <Boton variante="secundario" className="mt-3" onClick={refetch}>
          Reintentar
        </Boton>
      </div>
    );
  }

  const datos = indicadores || VACIO;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">Estado operativo de la atención de pacientes</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <TarjetaIndicador titulo="Registrados" valor={datos.registrados} icono={ICONOS.registrados} acento="slate" cargando={cargando} />
        <TarjetaIndicador titulo="Pendientes" valor={datos.pendientes} icono={ICONOS.pendientes} acento="amber" cargando={cargando} />
        <TarjetaIndicador titulo="En atención" valor={datos.en_atencion} icono={ICONOS.enAtencion} acento="blue" cargando={cargando} />
        <TarjetaIndicador titulo="Atendidos" valor={datos.atendidos} icono={ICONOS.atendidos} acento="green" cargando={cargando} />
        <TarjetaIndicador titulo="Prioridad alta" valor={datos.prioridad_alta} icono={ICONOS.prioridadAlta} acento="red" cargando={cargando} />
      </div>

      {!cargando && indicadores && <BarraDistribucion indicadores={indicadores} />}
    </div>
  );
}
