import express from 'express';
import morgan from 'morgan';
import { graph } from './services/ai/graph.js';
import { HumanMessage } from "langchain"

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

    const result = await graph.invoke({
        messages: [ new HumanMessage(userInput) ]
    }, {
        sandboxId
    })

})

export default app; 