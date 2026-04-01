import express from "express"
import { searchUser } from "../controllers/user.controller.js"


const router = express.Router()

router.get("/search", searchUser)


export default router;