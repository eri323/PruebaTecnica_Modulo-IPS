// Backend/src/validators/patient.validator.js
// Esquemas de validación para pacientes: creación, edición, query de listado e id de ruta.
const { z } = require('zod');

const TIPOS_DOCUMENTO = ['CC', 'TI', 'CE', 'PA'];
const GENEROS = ['Femenino', 'Masculino', 'Otro', 'Prefiere no informar'];
const PRIORIDADES = ['Alta', 'Media', 'Baja'];
const ESTADOS = ['Pendiente', 'En atención', 'Atendido'];

// Campos comunes a crear y editar. El estado se define aparte en cada esquema
// porque su comportamiento cambia: opcional al crear, obligatorio al editar.
const camposBase = {
  tipo_documento: z.enum(TIPOS_DOCUMENTO),
  documento: z.string().min(1).max(20),
  nombre_completo: z.string().min(1).max(150),
  // Se valida como string ISO y se rechaza si es futura; la BD también tiene su propio CHECK.
  fecha_nacimiento: z.string().refine((valor) => {
    const fecha = new Date(valor);
    return !Number.isNaN(fecha.getTime()) && fecha <= new Date();
  }, 'La fecha de nacimiento no puede ser futura ni inválida'),
  genero: z.enum(GENEROS),
  telefono: z.string().min(1),
  correo: z.string().email().optional().or(z.literal('')),
  eps_codigo: z.string().min(1),
  ciudad: z.string().optional(),
  prioridad: z.enum(PRIORIDADES),
};

// Al crear, un paciente nuevo entra como 'Pendiente' si no se especifica otra cosa.
const createPatientSchema = z.object({
  ...camposBase,
  estado: z.enum(ESTADOS).optional().default('Pendiente'),
});

// Al editar, el estado es obligatorio: con un default, un PUT que omitiera el campo
// devolvería a 'Pendiente' un paciente que ya estaba en atención (pérdida de datos silenciosa).
const updatePatientSchema = z.object({
  ...camposBase,
  estado: z.enum(ESTADOS),
});

// Construye un middleware que valida req.body contra el esquema dado.
function validarBody(esquema) {
  return (req, res, next) => {
    const resultado = esquema.safeParse(req.body);
    if (!resultado.success) {
      const mensaje = resultado.error.issues.map((i) => i.message).join(', ');
      return res.status(400).json({ error: mensaje });
    }
    req.body = resultado.data;
    next();
  };
}

const validateCreatePatient = validarBody(createPatientSchema);
const validateUpdatePatient = validarBody(updatePatientSchema);

// Esquema de query params para GET /patients (listado paginado con filtros).
const listQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  estado: z.enum(ESTADOS).optional(),
  prioridad: z.enum(PRIORIDADES).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

// Middleware: valida y normaliza los query params del listado.
// No se reasigna req.query: en Express 5 es de solo lectura y la asignación se ignora en silencio.
function validateListQuery(req, res, next) {
  const resultado = listQuerySchema.safeParse(req.query);
  if (!resultado.success) {
    const mensaje = resultado.error.issues.map((i) => i.message).join(', ');
    return res.status(400).json({ error: mensaje });
  }
  req.listQuery = resultado.data;
  next();
}

// Middleware: sin esto, un :id no numérico llega al query de Postgres y revienta con un 500 en HTML.
function validateId(req, res, next) {
  if (!/^[1-9]\d*$/.test(req.params.id)) {
    return res.status(400).json({ error: 'Id de paciente inválido' });
  }
  next();
}

module.exports = {
  validateCreatePatient,
  validateUpdatePatient,
  validateListQuery,
  validateId,
};
