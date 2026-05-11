import { search } from "./search.js";
import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent, tool } from "langchain";
import * as z from "zod";

const search_tool = tool(
    search,
    {
        name: "search_tool",
        description: "Use this tool to find latest information on the internet. Mandatory to use this tool if you don't have the information about user query.",
        schema: z.object({
            query: z.string().describe("The search query to find information about")
        })
    }
)

const model = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-medium-latest",
})


const agent = createAgent({
    model,
    tools: [ search_tool ]
})

const response = await agent.invoke({
    messages: [
        {
            role: "system",
            content: "Mandatory: Keep response under 100 words"
        },
        {
            role: "user",
            content: `What is the latest news about AI?

            current date is ${new Date().toDateString()}. 
            
            `
        }
    ]
})

console.log("========================================================")
console.log("response =>", response)
console.log("========================================================")