import express from "express";
import mongoose from "mongoose";
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import redis from "./config/cache.js";


const notesCollection = mongoose.connection.collection("notes");

const app = express();

app.use(express.json());


const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                    // 100 requests per window per IP
    message: {
        error: 'Too many requests. Please try again later.'
    },
    statusCode: 429,
    standardHeaders: true,   // sends RateLimit-* headers
    // legacyHeaders: false,
});

// Apply to every route
app.use(globalLimiter);


app.get("/", (req, res) => {
    res.send("Hello World!");
});

const noteLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many login attempts. Try again in 15 minutes.' },
    keyGenerator: ipKeyGenerator,
});

app.get("/api/notes", noteLimiter, async (req, res) => {
    const cachedNotes = await redis.get("notes");

    if (cachedNotes) {
        return res.json(JSON.parse(cachedNotes));
    }

    const notes = await notesCollection.find({}).toArray();

    await redis.set("notes", JSON.stringify(notes), "EX", 30);

    res.json(notes);
})

app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
    }

    const newNote = { title, content };
    const result = await notesCollection.insertMany([ newNote ]);



    return res.status(201).json({
        _id: result.insertedIds[ 0 ],
        title,
        content
    });
})

export default app;