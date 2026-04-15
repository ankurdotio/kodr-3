import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { getMessages, getUsers } from "../controllers/chat.controller.js";


const router = Router();


/**
 * GET /api/chats/users
 */
router.get("/users", authUser, getUsers)

/**
 * GET /api/chats/messages/:userId
 */
router.get("/messages/:userId", authUser, getMessages)

export default router;