require('dotenv').config();
const path = require('path');
const XLSX = require('xlsx');
const bcrypt = require('bcrypt');
const pool = require('../src/config/db');

// El Excel vive fuera del repo, en la carpeta padre "Prueba Tecnica" (hermana de este proyecto).
const RUTA_EXCEL = path.join(__dirname, '../../../Datos_Sinteticos_Prueba_Full_Stack_Junior_2026.xlsx');

async function seedEps(workbook) {
  const hoja = workbook.Sheets['Catalogos'];
  const filas = XLSX.utils.sheet_to_json(hoja, { header: 1 });

  // Las 2 primeras columnas (A y B) son eps_codigo / eps_nombre, saltando encabezado
  const epsRows = filas.slice(1).filter(r => r[0]); // corta cuando no hay eps_codigo

  for (const [eps_codigo, eps_nombre] of epsRows) {
    await pool.query(
      `INSERT INTO eps (eps_codigo, eps_nombre)
       VALUES ($1, $2)
       ON CONFLICT (eps_codigo) DO NOTHING`,
      [eps_codigo, eps_nombre]
    );
  }
  console.log(`✔ EPS insertadas: ${epsRows.length}`);
}

async function seedUsuarios(workbook) {
  const hoja = workbook.Sheets['Usuarios_Login'];
  const usuarios = XLSX.utils.sheet_to_json(hoja); // usa encabezados como keys

  for (const u of usuarios) {
    const hash = await bcrypt.hash(u.password_demo, 10);
    await pool.query(
      `INSERT INTO usuarios (usuario, nombre, password_hash, rol, activo)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (usuario) DO NOTHING`,
      [u.usuario, u.nombre, hash, u.rol, u.activo]
    );
  }
  console.log(`✔ Usuarios insertados: ${usuarios.length}`);
}

async function seedPacientes(workbook) {
  const hoja = workbook.Sheets['Pacientes'];
  const pacientes = XLSX.utils.sheet_to_json(hoja, { raw: false }); // raw:false -> fechas como string legible

  let insertados = 0;
  for (const p of pacientes) {
    await pool.query(
      `INSERT INTO pacientes
        (tipo_documento, documento, nombre_completo, fecha_nacimiento, genero,
         telefono, correo, eps_codigo, ciudad, prioridad, estado,
         fecha_creacion, fecha_actualizacion)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (tipo_documento, documento) DO NOTHING`,
      [
        p.tipo_documento,
        p.documento,
        p.nombre_completo,
        new Date(p.fecha_nacimiento),
        p.genero,
        p.telefono,
        p.correo,
        p.eps_codigo,
        p.ciudad,
        p.prioridad,
        p.estado,
        new Date(p.fecha_creacion),
        new Date(p.fecha_actualizacion),
      ]
    );
    insertados++;
  }
  console.log(`✔ Pacientes insertados: ${insertados}`);
}

async function main() {
  const workbook = XLSX.readFile(RUTA_EXCEL);

  console.log('Iniciando carga de datos sintéticos...');
  await seedEps(workbook);
  await seedUsuarios(workbook);
  await seedPacientes(workbook);

  console.log('Seed completado.');
  await pool.end();
}

main().catch(err => {
  console.error('Error en seed:', err);
  process.exit(1);
});