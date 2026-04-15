import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import postRouter from './routes/post.routes.js';
import userRouter from './routes/user.routes.js';
import chatRouter from './routes/chat.routes.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { config } from './config/config.js';


const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"))

app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}))


app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);


app.get("*name", (req, res) => {

    console.log(req.params.name)

    res.sendFile("index.html", { root: "public" });
})

export default app;