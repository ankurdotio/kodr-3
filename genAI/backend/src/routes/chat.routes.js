import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { handleMessage } from "../controllers/chat.controller.js";

const chatRouter = Router();

/**
 * @routes POST /api/chats
 * @argument req.body = {content:string,chatId:string?}
 */
chatRouter.post("/", authMiddleware, handleMessage);


export default chatRouter;