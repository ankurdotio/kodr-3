import express from "express"
import { getMe, register } from "../controllers/auth.controller.js"

const authRouter = express.Router()

/**
 * /api/auth/register
 */
authRouter.post("/register", register)

/**
 * GET /api/auth/get-me
 */
authRouter.get("/get-me", getMe)

export default authRouter