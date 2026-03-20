import { register, googleCallback } from '../controllers/auth.controller.js';
import { registerValidation } from '../validator/auth.validator.js';
import passport from 'passport';
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

// GET /api/auth/google
router.get("/google",
  passport.authenticate("google", {
    scope: [ "profile", "email" ],
  })
)


router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleCallback
)

export default router;
