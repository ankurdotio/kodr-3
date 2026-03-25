import { Router } from "express";
import { registerValidationRules, loginValidationRules } from "../validators/auth.validator.js";
import { getMe, login, register, googleAuthCallback } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import passport from "passport";

const authRouter = Router();

// /api/auth/register
authRouter.post("/register", registerValidationRules, register)

// /api/auth/login
authRouter.post("/login", loginValidationRules, login)

// /api/auth/me
authRouter.get("/me", authUser, getMe)


// /api/auth/google
authRouter.get("/google",
    passport.authenticate("google", { scope: [ "profile", "email" ] })
)

// /api/auth/google/callback
authRouter.get("/google/callback",
    passport.authenticate("google", { session: false }),
    googleAuthCallback
)

export default authRouter;