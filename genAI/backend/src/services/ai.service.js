import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent, toolStrategy } from "langchain"
import z from "zod";

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

export async function getTitle({ message }) {

    const titleAgent = createAgent({
        model,
        tools: [],
        responseFormat: toolStrategy(z.object({
            chatTitle: z.string().describe("A concise title for the given message")
        }))
    })

    const response = await titleAgent.invoke({
        messages: [
            {
                role: "user",
                content: `Generate a concise title for the following message: ${message}`
            }
        ],
    })

    console.log(response.structuredResponse)

    return response.structuredResponse

}