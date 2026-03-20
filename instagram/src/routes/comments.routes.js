import express from 'express';

const router = express.Router();

// GET /api/comments/:postId - Get all comments for a post
router.get('/:postId', (req, res) => {
  res.json({ message: 'Get all comments for a post' });
});

// POST /api/comments - Create new comment
router.post('/', (req, res) => {
  res.json({ message: 'Create comment' });
});

// DELETE /api/comments/:id - Delete comment
router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete comment' });
});

export default router;
