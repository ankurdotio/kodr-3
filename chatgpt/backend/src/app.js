import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { generateResponse } from './service/ai.service.js';


const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Hello World!");
})

const messages = []

app.post("/chat", async (req, res) => {

    const userInput = req.body.message;

    messages.push({
        role: "user",
        content: userInput
    })

    const content = await generateResponse(messages);

    messages.push({
        role: "assistant",
        content
    })

    res.json({ content });
})


export default app;