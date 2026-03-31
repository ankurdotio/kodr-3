import express from 'express';
import { authUser } from '../middleware/auth.middleware.js';
import multer from 'multer';
import { createPost, getPosts } from '../controllers/post.controller.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 15 * 1024 * 1024, // 15 MB
    }
})

const router = express.Router();


// POST /api/posts/
router.post("/", authUser, upload.array('media', 7), createPost)


// GET /api/posts/
router.get("/", authUser, getPosts)

export default router;