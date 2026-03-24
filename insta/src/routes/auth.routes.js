import { Router } from "express";
import { registerValidationRules } from "../validators/auth.validator.js";

const authRouter = Router();


authRouter.post("/register", registerValidationRules)


export default authRouter;