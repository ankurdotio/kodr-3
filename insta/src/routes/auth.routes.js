import { Router } from "express";
import { registerValidationRules, loginValidationRules } from "../validators/auth.validator.js";
import { getMe, login, register } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

// /api/auth/register
authRouter.post("/register", registerValidationRules, register)

// /api/auth/login
authRouter.post("/login", loginValidationRules, login)

// /api/auth/me
authRouter.get("/me", authUser, getMe)


export default authRouter;