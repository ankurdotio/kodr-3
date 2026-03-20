import express from 'express';

const router = express.Router();

// GET /api/posts - Get all posts
router.get('/', (req, res) => {
  res.json({ message: 'Get all posts' });
});

// GET /api/posts/:id - Get single post
router.get('/:id', (req, res) => {
  res.json({ message: 'Get single post' });
});

// POST /api/posts - Create new post
router.post('/', (req, res) => {
  res.json({ message: 'Create post' });
});

// PUT /api/posts/:id - Update post
router.put('/:id', (req, res) => {
  res.json({ message: 'Update post' });
});

// DELETE /api/posts/:id - Delete post
router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete post' });
});

export default router;
