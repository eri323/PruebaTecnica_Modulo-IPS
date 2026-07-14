// Backend/src/validators/auth.validator.js
// Valida el body de login antes de que llegue al controlador.
const { z } = require('zod');

const loginSchema = z.object({
  usuario: z.string().min(1, 'El usuario es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

// Middleware: si el body no cumple el esquema, corta con 400 antes de tocar la BD.
function validateLogin(req, res, next) {
  const resultado = loginSchema.safeParse(req.body);
  if (!resultado.success) {
    const mensaje = resultado.error.issues.map((i) => i.message).join(', ');
    return res.status(400).json({ error: mensaje });
  }
  req.body = resultado.data;
  next();
}

module.exports = { validateLogin };
