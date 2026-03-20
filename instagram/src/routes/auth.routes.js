import { register } from '../controllers/auth.controller.js';
import { registerValidation } from '../validator/auth.validator.js';
import express from 'express';

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerValidation, register);

// POST /api/auth/login
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint' });
});

export default router;
