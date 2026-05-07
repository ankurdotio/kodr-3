import { Router } from "express"
import { handleMessage } from "../controllers/chat.controller.js"

const router = Router()

/**
 * @route POST /api/chat/message
 */
router.post("/message", handleMessage)

export default router