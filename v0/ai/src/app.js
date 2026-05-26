import express from 'express';
import morgan from 'morgan';
import { HumanMessage } from "langchain"
import { codeAgent } from './services/ai/llm.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/_status/healthz', (req, res) => {
    res.send('Hello, World!');
});

app.get('/_status/readyz', (req, res) => {
    res.send('Hello, World!');
});

app.post('/api/ai/invoke', async (req, res) => {
    const { userInput, sandboxId } = req.body;



    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
    });


    const keepalive = setInterval(() => {
        res.write(': keepalive\n\n');
    }, 15000);

    try {
        const stream = await codeAgent.stream({
            messages: [ new HumanMessage(userInput) ]
        }, {
            streamMode: "custom", subgraphs: true,
            configurable: {
                sandboxId,
                timeout: 6000000
            },
            recursionLimit: 100,          // ← allow up to 100 agent loop iterations
            timeout: 10 * 60 * 1000,
        })

        for await (const message of stream) {

            console.log("Received message from Code Agent:", message)

            if (message instanceof HumanMessage) {
                continue; // skip human messages
            }

            res.write(`data: ${JSON.stringify(message)}\n\n`); // send message to client as SSE
        }

        res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`)
        res.end()
    } catch (error) {
        console.error("AI invoke failed:", error)

        if (!res.headersSent) {
            res.status(500)
        }

        res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`)
        res.end()
    }
})

export default app; 