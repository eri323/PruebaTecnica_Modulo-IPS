// Backend/src/controllers/eps.controller.js
// Catálogo de EPS para poblar selects en el frontend.
const pool = require('../config/db');

// GET /eps: lista completa del catálogo (pocas filas, sin paginación).
async function list(req, res) {
  const { rows } = await pool.query('SELECT eps_codigo, eps_nombre FROM eps ORDER BY eps_nombre');
  res.json(rows);
}

module.exports = { list };
