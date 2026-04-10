import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { getUsers } from "../controllers/chat.controller.js";


const router = Router();


/**
 * GET /api/chats/users
 */
router.get("/users", authUser, getUsers)

export default router;