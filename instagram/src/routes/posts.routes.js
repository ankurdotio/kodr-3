import express from 'express';
import multer from 'multer';
import { createPost, getPosts, getPostById, updatePost } from '../controllers/post.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  }
});

const router = express.Router();

// GET /api/posts - Get all posts
router.get('/', authMiddleware, getPosts);

// GET /api/posts/:id - Get single post
router.get('/:id', authMiddleware, getPostById);

// POST /api/posts - Create new post
router.post('/', authMiddleware, upload.array("media", 10), createPost);

// PUT /api/posts/:id - Update post
router.patch('/:id', authMiddleware, updatePost);

// DELETE /api/posts/:id - Delete post
router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete post' });
});

export default router;
