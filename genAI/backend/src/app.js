import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from './config/config.js';
import chatRoutes from './routes/chat.routes.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5173/api/auth/google/callback"
},
    (accessToken, refreshToken, profile, done) => {
        // Handle user authentication logic here
        done(null, profile);
    })
);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);


export default app;