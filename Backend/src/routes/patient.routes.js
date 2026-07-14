// Backend/src/routes/patient.routes.js
// CRUD de pacientes.
const express = require('express');
const { list, getById, create, update, remove } = require('../controllers/patient.controller');
const { validatePatient, validateListQuery } = require('../validators/patient.validator');

const router = express.Router();

router.get('/', validateListQuery, list);
router.get('/:id', getById);
router.post('/', validatePatient, create);
router.put('/:id', validatePatient, update);
router.delete('/:id', remove);

module.exports = router;
