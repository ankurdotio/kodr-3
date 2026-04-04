import express from "express"
import { followUser, searchUser } from "../controllers/user.controller.js"
import { authUser } from "../middleware/auth.middleware.js"
import { validateFollowUser } from "../validators/user.validator.js"

const router = express.Router()

router.get("/search", authUser, searchUser)

router.post("/follow/:userId", validateFollowUser, authUser, followUser)


export default router;