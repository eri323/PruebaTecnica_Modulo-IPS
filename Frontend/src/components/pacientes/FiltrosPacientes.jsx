// Frontend/src/components/pacientes/FiltrosPacientes.jsx
// Buscador y filtros del listado. El estado vive en la página (Pacientes.jsx) porque
// también lo necesita el hook de datos; aquí solo se pinta y se notifican los cambios.
import Campo from '../ui/Campo';
import Select from '../ui/Select';
import Boton from '../ui/Boton';

const ESTADOS = ['Pendiente', 'En atención', 'Atendido'].map((v) => ({ valor: v, texto: v }));
const PRIORIDADES = ['Alta', 'Media', 'Baja'].map((v) => ({ valor: v, texto: v }));

export default function FiltrosPacientes({ filtros, onCambiar, onLimpiar }) {
  const hayFiltros = Boolean(filtros.search || filtros.estado || filtros.prioridad);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-end">
      <Campo
        id="search"
        label="Buscar"
        valor={filtros.search}
        onChange={(e) => onCambiar('search', e.target.value)}
        placeholder="Nombre o documento"
        className="flex-1"
      />
      <Select
        id="estado"
        label="Estado"
        valor={filtros.estado}
        onChange={(e) => onCambiar('estado', e.target.value)}
        opciones={ESTADOS}
        placeholder="Todos"
        className="md:w-48"
      />
      <Select
        id="prioridad"
        label="Prioridad"
        valor={filtros.prioridad}
        onChange={(e) => onCambiar('prioridad', e.target.value)}
        opciones={PRIORIDADES}
        placeholder="Todas"
        className="md:w-40"
      />
      {hayFiltros && (
        <Boton variante="secundario" onClick={onLimpiar} className="md:mb-0">
          Limpiar
        </Boton>
      )}
    </div>
  );
}
