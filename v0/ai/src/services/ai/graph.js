import { StateGraph, MessagesValue, StateSchema, START, END } from "@langchain/langgraph"
import { codeAgent, intentAgent } from "./llm.js"
import { HumanMessage } from "langchain"

const state = new StateSchema({
    messages: MessagesValue
})


const intentNode = async ({ messages }, config) => {
    console.log("Invoking Intent Agent with messages:", messages, "and config:", config)

    const response = await intentAgent.invoke({ messages }, {
        configurable: {
            sandboxId: config.configurable.sandboxId
        }
    })

    const plan = response.structuredResponse.implementationPlan

    console.log("Plan:", plan)

    return {
        messages: new HumanMessage("Plan:\n" + plan)
    }
}
const codeNode = async ({ messages }, config) => {

    console.log("Invoking Code Agent with messages:", messages, "and config:", config)

    const response = await codeAgent.invoke({ messages }, {
        configurable: {
            sandboxId: config.configurable.sandboxId
        }
    })

    return {
        messages: response.messages
    }
}

export const graph = new StateGraph(state)
    // .addNode("intent", intentNode)
    .addNode("code", codeNode)
    // .addEdge("intent", "code")
    .addEdge(START, "code")
    .addEdge("code", END)
    .compile()


