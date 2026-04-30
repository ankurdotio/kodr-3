import * as chatDao from "../dao/chat.dao.js";
import { getAIResponse, getTitle } from "../services/ai.service.js";


export async function handleMessage(req, res) {
    const { content, chatId } = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");


    if (!chatId) {
        const data = await getTitle({ message: content })
    }

    const stream = await getAIResponse({ content });

    for await (const chunk of stream) {
        res.write(`data: ${chunk[ 0 ].contentBlocks[ 0 ].text}\n\n`);
    }

    res.write(`data: [DONE]\n\n`);
    res.end()
}