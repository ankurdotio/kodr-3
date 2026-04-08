import express from "express"
import { followUser, searchUser, getFollowRequests, acceptFollowRequest } from "../controllers/user.controller.js"
import { authUser } from "../middleware/auth.middleware.js"
import { validateFollowUser, validateFollowRequest } from "../validators/user.validator.js"

const router = express.Router()

router.get("/search", authUser, searchUser)

router.post("/follow/:userId", validateFollowUser, authUser, followUser)

router.get("/follow-requests", authUser, getFollowRequests)

router.patch("/follow-requests/:requestId", validateFollowRequest, authUser, acceptFollowRequest)


export default router;