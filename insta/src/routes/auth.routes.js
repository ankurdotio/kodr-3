import { Router } from "express";
import { registerValidationRules } from "../validators/auth.validator.js";
import { register } from "../controllers/auth.controller.js";

const authRouter = Router();

// /api/auth/register
authRouter.post("/register", registerValidationRules, register)


export default authRouter;