import express from 'express';

const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint' });
});

export default router;
