// Backend/src/controllers/dashboard.controller.js
// Indicadores operativos para el dashboard: se calculan con un solo query usando FILTER
// para no golpear la BD con 5 consultas separadas.
const pool = require('../config/db');

// GET /dashboard: registrados, pendientes, en atención, atendidos y prioridad alta.
async function getIndicadores(req, res) {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*)::int AS registrados,
      COUNT(*) FILTER (WHERE estado = 'Pendiente')::int AS pendientes,
      COUNT(*) FILTER (WHERE estado = 'En atención')::int AS en_atencion,
      COUNT(*) FILTER (WHERE estado = 'Atendido')::int AS atendidos,
      COUNT(*) FILTER (WHERE prioridad = 'Alta')::int AS prioridad_alta
    FROM pacientes
  `);

  res.json(rows[0]);
}

module.exports = { getIndicadores };
