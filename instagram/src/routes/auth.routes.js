import { register, googleCallback, login, getMe } from '../controllers/auth.controller.js';
import { registerValidation, loginValidation } from '../validator/auth.validator.js';
import passport from 'passport';
import express from 'express';

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerValidation, register);

// POST /api/auth/login
router.post('/login', loginValidation, login);

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

// GET /api/auth/google/callback
router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleCallback
)

// GET /api/auth/me
router.get("/me", getMe)


export default router;
