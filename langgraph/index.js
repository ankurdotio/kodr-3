import "dotenv/config";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, ToolMessage, tool } from "langchain";
import { StateGraph, START, END, StateSchema, MessagesValue } from "@langchain/langgraph"
import * as z from "zod"


const get_weather = tool(
    async ({ city }) => {
        return `The weather in ${city} is sunny.`
    },
    {
        name: "get_weather",
        description: "Get the weather for a city",
        schema: z.object({
            city: z.string().describe("The city to get the weather for")
        })
    }
)

const tools = {
    get_weather
}

const model = (new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRALAI_API_KEY
})).bindTools([ get_weather ])

const state = new StateSchema({
    messages: MessagesValue,
})

const llmNode = async (state) => {
    console.log(state)
    const aiResponse = await model.invoke(state.messages)
    return {
        messages: [ aiResponse ]
    }
}

const toolNode = async (state) => {
    const lastMessage = state.messages[ state.messages.length - 1 ]

    const toolCall = lastMessage.tool_calls[ 0 ]

    const toolResponse = await tools[ toolCall.name ].invoke(toolCall)

    return {
        messages: [
            toolResponse
        ]
    }

}

const graph = new StateGraph(state)
    .addNode("llm", llmNode)
    .addNode("tool", toolNode)
    .addEdge(START, "llm")
    .addConditionalEdges("llm", (state) => {
        const lastMessage = state.messages[ state.messages.length - 1 ]
        if (lastMessage.tool_calls.length > 0) {
            return "tool"
        }
        return END
    })
    .addEdge("tool", "llm")
    .compile()

const result = await graph.invoke({
    messages: [
        new HumanMessage("What is the weather in new DElhi?")
    ]
})


console.log(result)