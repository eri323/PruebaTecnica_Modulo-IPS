// Backend/src/routes/patient.routes.js
// CRUD de pacientes.
const express = require('express');
const { list, getById, create, update, remove } = require('../controllers/patient.controller');
const {
  validateCreatePatient,
  validateUpdatePatient,
  validateListQuery,
  validateId,
} = require('../validators/patient.validator');

const router = express.Router();

router.get('/', validateListQuery, list);
router.get('/:id', validateId, getById);
router.post('/', validateCreatePatient, create);
// PUT usa el esquema de edición: exige estado para no resetearlo a 'Pendiente' al omitirlo.
router.put('/:id', validateId, validateUpdatePatient, update);
router.delete('/:id', validateId, remove);

module.exports = router;
