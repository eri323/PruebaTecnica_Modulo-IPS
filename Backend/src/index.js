// Backend/src/index.js
// Punto de entrada de la API: arma la app de Express y levanta el servidor.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const epsRoutes = require('./routes/eps.routes');
const patientRoutes = require('./routes/patient.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const { verifyToken } = require('./middleware/auth.middleware');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de salud para verificar que el servidor levantó correctamente.
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Rutas de autenticación: login y consulta del usuario autenticado.
app.use('/auth', authRoutes);

// Catálogo de EPS (protegido).
app.use('/eps', verifyToken, epsRoutes);

// CRUD de pacientes (protegido).
app.use('/patients', verifyToken, patientRoutes);

// Indicadores del dashboard (protegido).
app.use('/dashboard', verifyToken, dashboardRoutes);

// Ruta desconocida: responde JSON, no el HTML por defecto de Express.
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador central de errores: Express 5 reenvía aquí los rechazos de los controladores async.
// Se registra el detalle en consola pero al cliente solo le llega un mensaje genérico:
// la página de error por defecto expone el stack trace.
// eslint-disable-next-line no-unused-vars -- Express identifica el manejador de errores por sus 4 parámetros
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
