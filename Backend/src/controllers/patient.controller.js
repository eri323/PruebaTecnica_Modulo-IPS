// Backend/src/controllers/patient.controller.js
// CRUD de pacientes: listado paginado con filtros, detalle, creación, edición y borrado.
const pool = require('../config/db');

// Select base reutilizado por list/getById/create/update: siempre trae el nombre de la EPS.
const SELECT_CON_EPS = `
  SELECT p.paciente_id, p.tipo_documento, p.documento, p.nombre_completo,
         p.fecha_nacimiento, p.genero, p.telefono, p.correo, p.eps_codigo,
         e.eps_nombre, p.ciudad, p.prioridad, p.estado,
         p.fecha_creacion, p.fecha_actualizacion
  FROM pacientes p
  JOIN eps e ON p.eps_codigo = e.eps_codigo
`;

// GET /patients: listado paginado con búsqueda (nombre/documento) y filtros (estado/prioridad).
async function list(req, res) {
  const { search, estado, prioridad, page, limit } = req.listQuery;
  const offset = (page - 1) * limit;

  const condiciones = [];
  const valores = [];

  if (search) {
    valores.push(`%${search}%`);
    condiciones.push(`(p.nombre_completo ILIKE $${valores.length} OR p.documento ILIKE $${valores.length})`);
  }
  if (estado) {
    valores.push(estado);
    condiciones.push(`p.estado = $${valores.length}`);
  }
  if (prioridad) {
    valores.push(prioridad);
    condiciones.push(`p.prioridad = $${valores.length}`);
  }

  const whereSql = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const totalResult = await pool.query(`SELECT COUNT(*) FROM pacientes p ${whereSql}`, valores);
  const total = parseInt(totalResult.rows[0].count, 10);

  const valoresConPaginacion = [...valores, limit, offset];
  const dataResult = await pool.query(
    `${SELECT_CON_EPS} ${whereSql} ORDER BY p.fecha_creacion DESC LIMIT $${valoresConPaginacion.length - 1} OFFSET $${valoresConPaginacion.length}`,
    valoresConPaginacion
  );

  res.json({
    data: dataResult.rows,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

// GET /patients/:id
async function getById(req, res) {
  const { id } = req.params;
  const { rows } = await pool.query(`${SELECT_CON_EPS} WHERE p.paciente_id = $1`, [id]);
  if (!rows[0]) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }
  res.json(rows[0]);
}

// POST /patients
async function create(req, res) {
  const p = req.body;

  const epsExiste = await pool.query('SELECT 1 FROM eps WHERE eps_codigo = $1', [p.eps_codigo]);
  if (epsExiste.rowCount === 0) {
    return res.status(400).json({ error: 'eps_codigo no existe' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO pacientes
        (tipo_documento, documento, nombre_completo, fecha_nacimiento, genero,
         telefono, correo, eps_codigo, ciudad, prioridad, estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING paciente_id`,
      [p.tipo_documento, p.documento, p.nombre_completo, p.fecha_nacimiento, p.genero,
        p.telefono, p.correo || null, p.eps_codigo, p.ciudad || null, p.prioridad, p.estado]
    );
    const creado = await pool.query(`${SELECT_CON_EPS} WHERE p.paciente_id = $1`, [rows[0].paciente_id]);
    res.status(201).json(creado.rows[0]);
  } catch (err) {
    // 23505 = violación de UNIQUE (tipo_documento, documento) en Postgres.
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ya existe un paciente con ese tipo y número de documento' });
    }
    throw err;
  }
}

// PUT /patients/:id (reemplazo completo)
async function update(req, res) {
  const { id } = req.params;
  const p = req.body;

  const existente = await pool.query('SELECT 1 FROM pacientes WHERE paciente_id = $1', [id]);
  if (existente.rowCount === 0) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }

  const epsExiste = await pool.query('SELECT 1 FROM eps WHERE eps_codigo = $1', [p.eps_codigo]);
  if (epsExiste.rowCount === 0) {
    return res.status(400).json({ error: 'eps_codigo no existe' });
  }

  try {
    await pool.query(
      `UPDATE pacientes SET
        tipo_documento = $1, documento = $2, nombre_completo = $3, fecha_nacimiento = $4,
        genero = $5, telefono = $6, correo = $7, eps_codigo = $8, ciudad = $9,
        prioridad = $10, estado = $11, fecha_actualizacion = NOW()
       WHERE paciente_id = $12`,
      [p.tipo_documento, p.documento, p.nombre_completo, p.fecha_nacimiento, p.genero,
        p.telefono, p.correo || null, p.eps_codigo, p.ciudad || null, p.prioridad, p.estado, id]
    );
    const actualizado = await pool.query(`${SELECT_CON_EPS} WHERE p.paciente_id = $1`, [id]);
    res.json(actualizado.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ya existe un paciente con ese tipo y número de documento' });
    }
    throw err;
  }
}

// DELETE /patients/:id (borrado físico; nada referencia a pacientes)
async function remove(req, res) {
  const { id } = req.params;
  const resultado = await pool.query('DELETE FROM pacientes WHERE paciente_id = $1', [id]);
  if (resultado.rowCount === 0) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }
  res.status(204).send();
}

module.exports = { list, getById, create, update, remove };
