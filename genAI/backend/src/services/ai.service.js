import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent } from "langchain"

const model = new ChatMistralAI({
    model: "mistral-medium-latest",
});

const agent = createAgent({
    model,
    tools: [],
})

export async function getAIResponse({ content }) {
    const stream = await agent.stream(
        {
            messages: [
                { role: "user", content }
            ]
        },
        { streamMode: "messages" })

    return stream;
}