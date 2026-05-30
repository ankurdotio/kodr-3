import { StateGraph, MessagesValue, StateSchema, START, END } from "@langchain/langgraph"
import { codeAgent, intentAgent } from "./llm.js"
import { HumanMessage } from "langchain"

const state = new StateSchema({
    messages: MessagesValue
})


const intentNode = async ({ messages }, config) => {
    if (config.writer) {
        config.writer({ type: "message", content: "🤖 Analyzing request and planning file structure...\n" });
    }

    const response = await intentAgent.invoke({ messages }, config)

    const plan = response.structuredResponse.implementationPlan

    if (config.writer) {
        config.writer({ type: "message", content: "✅ Implementation plan generated.\n\n" });
    }

    console.log("Plan:", plan)

    return {
        messages: new HumanMessage("Plan:\n" + plan)
    }
}
const codeNode = async ({ messages }, config) => {
    console.log("Invoking Code Agent with messages:", messages, "and config:", config)

    const response = await codeAgent.invoke({ messages }, {
        ...config,
        callbacks: [
            ...(config.callbacks || []),
            {
                handleLLMNewToken(token) {
                    if (config.writer && token) {
                        config.writer({ type: "message", content: token });
                    }
                }
            }
        ]
    })

    return {
        messages: response.messages
    }
}

export const graph = new StateGraph(state)
    .addNode("intent", intentNode)
    .addNode("code", codeNode)
    .addEdge("intent", "code")
    .addEdge(START, "intent")
    .addEdge("code", END)
    .compile()


