import * as chatDao from "../dao/chat.dao.js";
import { getAIResponse, getTitle } from "../services/ai.service.js";


export async function handleMessage(req, res) {
    const { content, chatId } = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");


    const generateTitle = async () => {
        if (!chatId) {
            const data = await getTitle({ message: content })
            const chat = await chatDao.createChat({ title: data.chatTitle, user: req.user.id })
            res.write(`title: ${JSON.stringify({ title: data.chatTitle, chatId: chat._id })}\n\n`)
            return chat
        }
        return null
    }

    const aiStream = async () => {
        const stream = await getAIResponse({ content });

        let AIMessage = ""

        for await (const chunk of stream) {
            AIMessage += chunk[ 0 ].contentBlocks[ 0 ].text;
            res.write(`data: ${JSON.stringify({ text: chunk[ 0 ].contentBlocks[ 0 ].text })}\n\n`);
        }

        return AIMessage
    }

    const [ chat, AIMessage ] = await Promise.all([ generateTitle(), aiStream() ])

    // res.write(`data: [DONE]\n\n`);
    res.end()
}