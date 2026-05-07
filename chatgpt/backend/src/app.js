import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import chatRoutes from './routes/chat.routes.js';


const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use("/api/chat", chatRoutes)


export default app;