import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';


const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});


export default app;