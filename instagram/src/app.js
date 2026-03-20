import express from 'express';
import authRoutes from './routes/auth.routes.js';
import postsRoutes from './routes/posts.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import followsRoutes from './routes/follows.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import likesRoutes from './routes/likes.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Instagram API Server' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/follows', followsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/likes', likesRoutes);

export default app;
