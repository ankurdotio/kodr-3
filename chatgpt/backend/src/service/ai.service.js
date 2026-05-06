import { ChatMistralAI } from "@langchain/mistralai"
import config from "../config/config.js"

const model = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.mistralApiKey,
})

export async function generateResponse(messages) {
    const response = await model.stream(messages)
    return response.content
}