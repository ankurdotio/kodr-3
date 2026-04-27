import "dotenv/config";
import { ChatMistralAI } from "@langchain/mistralai"
import { createAgent } from "langchain";
import { latest_information } from "./tool.js";

const apiKey = process.env.MISTRAL_API_KEY || 'your_api_key';

const model = new ChatMistralAI({
    model: 'mistral-medium-latest',
    apiKey: apiKey,
})

const agent = createAgent({
    model,
    tools: [
        latest_information
    ]
})

export async function invokeAI(messages) {
    const chatResponse = await agent.invoke({
        messages: messages
    });

    console.log(JSON.stringify(chatResponse))

    return chatResponse
}