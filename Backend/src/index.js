// Backend/src/index.js
// Punto de entrada de la API: arma la app de Express y levanta el servidor.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de salud para verificar que el servidor levantó correctamente.
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Rutas de autenticación: login y consulta del usuario autenticado.
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
