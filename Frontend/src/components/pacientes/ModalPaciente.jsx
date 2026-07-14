// Frontend/src/components/pacientes/ModalPaciente.jsx
// Formulario de crear/editar en modal: al cerrarlo, la página conserva sus filtros y su paginación,
// lo que importa cuando el operador edita varios pacientes seguidos.
// Un solo componente cubre ambos casos; la diferencia es si recibe un paciente inicial o no.
import { useEffect, useState } from 'react';
import { crearPaciente, actualizarPaciente } from '../../services/pacientes.service';
import { useEps } from '../../hooks/useEps';
import Modal from '../ui/Modal';
import Campo from '../ui/Campo';
import Select from '../ui/Select';
import Boton from '../ui/Boton';

const TIPOS_DOCUMENTO = ['CC', 'TI', 'CE', 'PA'].map((v) => ({ valor: v, texto: v }));
const GENEROS = ['Femenino', 'Masculino', 'Otro', 'Prefiere no informar'].map((v) => ({ valor: v, texto: v }));
const PRIORIDADES = ['Alta', 'Media', 'Baja'].map((v) => ({ valor: v, texto: v }));
const ESTADOS = ['Pendiente', 'En atención', 'Atendido'].map((v) => ({ valor: v, texto: v }));

const FORM_VACIO = {
  tipo_documento: 'CC',
  documento: '',
  nombre_completo: '',
  fecha_nacimiento: '',
  genero: '',
  telefono: '',
  correo: '',
  eps_codigo: '',
  ciudad: '',
  prioridad: 'Media',
  estado: 'Pendiente',
};

// Espejo de las reglas de zod en el backend: el servidor sigue siendo la autoridad,
// esto solo evita un viaje al servidor para errores obvios.
function validar(form) {
  const errores = {};
  const hoy = new Date().toISOString().slice(0, 10);

  if (!form.tipo_documento) errores.tipo_documento = 'Requerido';
  if (!form.documento.trim()) errores.documento = 'Requerido';
  else if (form.documento.length > 20) errores.documento = 'Máximo 20 caracteres';
  if (!form.nombre_completo.trim()) errores.nombre_completo = 'Requerido';
  else if (form.nombre_completo.length > 150) errores.nombre_completo = 'Máximo 150 caracteres';
  if (!form.fecha_nacimiento) errores.fecha_nacimiento = 'Requerida';
  else if (form.fecha_nacimiento > hoy) errores.fecha_nacimiento = 'No puede ser una fecha futura';
  if (!form.genero) errores.genero = 'Requerido';
  if (!form.telefono.trim()) errores.telefono = 'Requerido';
  if (form.correo.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) errores.correo = 'Correo inválido';
  if (!form.eps_codigo) errores.eps_codigo = 'Requerida';
  if (!form.prioridad) errores.prioridad = 'Requerida';
  if (!form.estado) errores.estado = 'Requerido';

  return errores;
}

export default function ModalPaciente({ abierto, paciente, onCerrar, onGuardado }) {
  const editando = Boolean(paciente);
  const { eps, cargando: cargandoEps } = useEps();

  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Al abrir, el formulario se rellena con el paciente a editar o se limpia para crear uno nuevo;
  // sin esto, quedarían los datos del paciente anterior.
  useEffect(() => {
    if (!abierto) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reinicia el formulario al abrir el modal, no hay forma de derivarlo del render
    setErrores({});
    setErrorGeneral('');
    setForm(
      paciente
        ? {
            tipo_documento: paciente.tipo_documento,
            documento: paciente.documento,
            nombre_completo: paciente.nombre_completo,
            fecha_nacimiento: paciente.fecha_nacimiento,
            genero: paciente.genero,
            telefono: paciente.telefono,
            correo: paciente.correo || '',
            eps_codigo: paciente.eps_codigo,
            ciudad: paciente.ciudad || '',
            prioridad: paciente.prioridad,
            estado: paciente.estado,
          }
        : FORM_VACIO
    );
  }, [abierto, paciente]);

  function cambiar(campo, valor) {
    setForm((previo) => ({ ...previo, [campo]: valor }));
    setErrores((previos) => ({ ...previos, [campo]: undefined }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErrorGeneral('');

    const erroresValidacion = validar(form);
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    setGuardando(true);
    try {
      if (editando) {
        await actualizarPaciente(paciente.paciente_id, form);
      } else {
        await crearPaciente(form);
      }
      onGuardado(editando ? 'Paciente actualizado correctamente' : 'Paciente creado correctamente');
    } catch (err) {
      const mensaje = err.response?.data?.error || 'No se pudo guardar el paciente';
      // El 409 siempre es el documento duplicado: se muestra bajo ese campo, no como error suelto.
      if (err.response?.status === 409) {
        setErrores((previos) => ({ ...previos, documento: mensaje }));
      } else {
        setErrorGeneral(mensaje);
      }
    } finally {
      setGuardando(false);
    }
  }

  const opcionesEps = eps.map((item) => ({ valor: item.eps_codigo, texto: item.eps_nombre }));

  return (
    <Modal abierto={abierto} titulo={editando ? 'Editar paciente' : 'Nuevo paciente'} onCerrar={onCerrar}>
      <form onSubmit={enviar} noValidate className="space-y-4">
        {errorGeneral && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorGeneral}</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            id="tipo_documento"
            label="Tipo de documento"
            required
            valor={form.tipo_documento}
            onChange={(e) => cambiar('tipo_documento', e.target.value)}
            opciones={TIPOS_DOCUMENTO}
            error={errores.tipo_documento}
          />
          <Campo
            id="documento"
            label="Documento"
            required
            valor={form.documento}
            onChange={(e) => cambiar('documento', e.target.value)}
            error={errores.documento}
          />
        </div>

        <Campo
          id="nombre_completo"
          label="Nombre completo"
          required
          valor={form.nombre_completo}
          onChange={(e) => cambiar('nombre_completo', e.target.value)}
          error={errores.nombre_completo}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo
            id="fecha_nacimiento"
            label="Fecha de nacimiento"
            tipo="date"
            required
            valor={form.fecha_nacimiento}
            onChange={(e) => cambiar('fecha_nacimiento', e.target.value)}
            error={errores.fecha_nacimiento}
            max={new Date().toISOString().slice(0, 10)}
          />
          <Select
            id="genero"
            label="Género"
            required
            valor={form.genero}
            onChange={(e) => cambiar('genero', e.target.value)}
            opciones={GENEROS}
            error={errores.genero}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo
            id="telefono"
            label="Teléfono"
            required
            valor={form.telefono}
            onChange={(e) => cambiar('telefono', e.target.value)}
            error={errores.telefono}
          />
          <Campo
            id="correo"
            label="Correo"
            tipo="email"
            valor={form.correo}
            onChange={(e) => cambiar('correo', e.target.value)}
            error={errores.correo}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            id="eps_codigo"
            label="EPS"
            required
            valor={form.eps_codigo}
            onChange={(e) => cambiar('eps_codigo', e.target.value)}
            opciones={opcionesEps}
            placeholder={cargandoEps ? 'Cargando EPS...' : 'Seleccione una EPS'}
            disabled={cargandoEps}
            error={errores.eps_codigo}
          />
          <Campo
            id="ciudad"
            label="Ciudad"
            valor={form.ciudad}
            onChange={(e) => cambiar('ciudad', e.target.value)}
            error={errores.ciudad}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            id="prioridad"
            label="Prioridad"
            required
            valor={form.prioridad}
            onChange={(e) => cambiar('prioridad', e.target.value)}
            opciones={PRIORIDADES}
            error={errores.prioridad}
          />
          <Select
            id="estado"
            label="Estado"
            required
            valor={form.estado}
            onChange={(e) => cambiar('estado', e.target.value)}
            opciones={ESTADOS}
            error={errores.estado}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <Boton variante="secundario" onClick={onCerrar} disabled={guardando}>
            Cancelar
          </Boton>
          <Boton tipo="submit" cargando={guardando}>
            {editando ? 'Guardar cambios' : 'Crear paciente'}
          </Boton>
        </div>
      </form>
    </Modal>
  );
}
