// Backend/src/routes/auth.routes.js
// Define los endpoints de autenticación.
const express = require('express');
const { login, me } = require('../controllers/auth.controller');
const { validateLogin } = require('../validators/auth.validator');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/login', validateLogin, login);
router.get('/me', verifyToken, me);

module.exports = router;
