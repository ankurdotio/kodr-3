import express from 'express';
import morgan from 'morgan';
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import songsRouter from './routes/songs.routes.js';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRouter)
app.use("/api/songs", songsRouter)  



export default app;