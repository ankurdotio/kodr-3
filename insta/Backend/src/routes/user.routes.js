import express from "express"
import { followUser, searchUser, getFollowRequests } from "../controllers/user.controller.js"
import { authUser } from "../middleware/auth.middleware.js"
import { validateFollowUser } from "../validators/user.validator.js"

const router = express.Router()

router.get("/search", authUser, searchUser)

router.post("/follow/:userId", validateFollowUser, authUser, followUser)

router.get("/follow-requests", authUser, getFollowRequests)


export default router;