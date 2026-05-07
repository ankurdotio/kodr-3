import { ChatMistralAI } from "@langchain/mistralai"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { createAgent } from "langchain"
import config from "../config/config.js"

const model = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.mistralApiKey,
})

const agent = createAgent({
    model,
    tools: [],
})

export async function generateResponse(messages) {
    const response = await model.invoke(messages)
    return response.content
}

export async function getStream(messages) {
    const stream = await agent.stream({
        messages
    },
        {
            streamMode: "messages"
        }
    )

    return stream
}