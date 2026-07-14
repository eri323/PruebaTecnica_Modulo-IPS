// Backend/src/controllers/auth.controller.js
// Lógica de autenticación: valida credenciales contra la BD y firma el JWT.
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const MENSAJE_CREDENCIALES_INVALIDAS = 'Usuario o contraseña incorrectos';

// POST /auth/login: valida usuario/password contra la tabla usuarios y devuelve un JWT.
async function login(req, res) {
  const { usuario, password } = req.body;

  const { rows } = await pool.query(
    'SELECT usuario_id, usuario, nombre, password_hash, rol, activo FROM usuarios WHERE usuario = $1',
    [usuario]
  );
  const usuarioDb = rows[0];

  // Mismo mensaje para "no existe", "inactivo" o "password incorrecta": evita enumeración de usuarios.
  if (!usuarioDb || !usuarioDb.activo) {
    return res.status(401).json({ error: MENSAJE_CREDENCIALES_INVALIDAS });
  }

  const passwordValida = await bcrypt.compare(password, usuarioDb.password_hash);
  if (!passwordValida) {
    return res.status(401).json({ error: MENSAJE_CREDENCIALES_INVALIDAS });
  }

  const payload = {
    usuario_id: usuarioDb.usuario_id,
    usuario: usuarioDb.usuario,
    rol: usuarioDb.rol,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

  res.json({
    token,
    usuario: {
      usuario_id: usuarioDb.usuario_id,
      usuario: usuarioDb.usuario,
      nombre: usuarioDb.nombre,
      rol: usuarioDb.rol,
    },
  });
}

// GET /auth/me: devuelve los datos del usuario autenticado (decodificados del token por el middleware).
function me(req, res) {
  res.json({ usuario: req.usuario });
}

module.exports = { login, me };
