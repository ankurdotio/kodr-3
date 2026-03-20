import express from 'express';

const router = express.Router();

// GET /api/messages/:userId - Get messages with a specific user
router.get('/:userId', (req, res) => {
  res.json({ message: 'Get messages with user' });
});

// POST /api/messages - Send a message
router.post('/', (req, res) => {
  res.json({ message: 'Send message' });
});

// DELETE /api/messages/:id - Delete a message
router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete message' });
});

export default router;
