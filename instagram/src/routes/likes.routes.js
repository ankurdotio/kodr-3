import express from 'express';

const router = express.Router();

// POST /api/likes - Like a post
router.post('/', (req, res) => {
  res.json({ message: 'Like post' });
});

// DELETE /api/likes/:postId - Unlike a post
router.delete('/:postId', (req, res) => {
  res.json({ message: 'Unlike post' });
});

// GET /api/likes/:postId - Get all likes for a post
router.get('/:postId', (req, res) => {
  res.json({ message: 'Get all likes for a post' });
});

export default router;
