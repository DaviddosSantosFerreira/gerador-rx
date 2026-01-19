const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { register, login, refresh, logout } = require('../controllers/authController');
const router = express.Router();

// Rate limiter para login - 5 tentativas a cada 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para registro - 3 tentativas a cada hora
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 tentativas
  message: { message: 'Muitas tentativas de registro. Tente novamente em 1 hora.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para refresh - 10 tentativas a cada 15 minutos
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 tentativas
  message: { message: 'Muitas tentativas de refresh. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Registro
router.post('/register', registerLimiter, register);

// Login
router.post('/login', loginLimiter, login);

// Renovar token
router.post('/refresh', refreshLimiter, refresh);

// Logout (não precisa de limiter)
router.post('/logout', logout);

module.exports = router;

