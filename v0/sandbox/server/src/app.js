import express from 'express';
import morgan from 'morgan';
import { createPod, deletePod } from './kubernetes/pod.js';
import { createService, deleteService } from './kubernetes/service.js';
import { v7 as uuid } from "uuid"
import { redis, subscriber } from './config/redis.js';

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get("/_status/healthz", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.get("/_status/readyz", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.post("/api/sandbox/start", async (req, res) => {
    const sandboxId = uuid();

    await createPod(sandboxId);
    await createService(sandboxId);
    await redis.set(`sandbox:${sandboxId}`, "active", "EX", 60 * 20)

    res.status(201).json({
        message: "Sandbox environment created successfully",
        sandboxId,
        preview: `${sandboxId}.preview.localhost`
    });

})

subscriber.on("message", async (channel, key) => {
    const sandboxId = key.split(":")[ 1 ];

    await deletePod(sandboxId);
    await deleteService(sandboxId);
})

export default app;