// Backend/src/routes/eps.routes.js
// Catálogo de EPS (solo lectura).
const express = require('express');
const { list } = require('../controllers/eps.controller');

const router = express.Router();

router.get('/', list);

module.exports = router;
