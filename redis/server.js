import express from "express";
import { connectDB } from "./src/config/db.js";
import mongoose from "mongoose";
import redis from "./src/config/cache.js";
import rateLimit from 'express-rate-limit';

const notesCollection = mongoose.connection.collection("notes");

const app = express();
connectDB();


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
    keyGenerator: (req) => {
        return `${req.ip}:${req.path}`;
    },
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


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});