// Backend/src/routes/dashboard.routes.js
// Indicadores operativos (protegido por auth desde index.js).
const express = require('express');
const { getIndicadores } = require('../controllers/dashboard.controller');

const router = express.Router();

router.get('/', getIndicadores);

module.exports = router;
