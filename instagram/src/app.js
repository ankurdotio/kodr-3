import express from 'express';
import authRoutes from './routes/auth.routes.js';
import postsRoutes from './routes/posts.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import followsRoutes from './routes/follows.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import likesRoutes from './routes/likes.routes.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { config } from './config/config.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use(passport.initialize());

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback",
},(accessToken, refreshToken, profile, done) => {
  // Here you would typically find or create a user in your database
  // For this example, we'll just return the profile
  return done(null, profile);
}));

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
