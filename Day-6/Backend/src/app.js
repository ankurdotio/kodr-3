import express from 'express';
import morgan from 'morgan';
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import songsRouter from './routes/songs.routes.js';
import cors from "cors"

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: [ "GET", "POST" ]
}))


app.use("/api/auth", authRouter)
app.use("/api/songs", songsRouter)



export default app;