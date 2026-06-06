import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatOllama } from '@langchain/ollama';
import { createAgent } from "langchain";
import { HumanMessage } from '@langchain/core/messages';
import 'dotenv/config';

// 1. Connect to your MCP server
const client = new MultiServerMCPClient({
    mcpServers: {
        myServer: {
            transport: 'stdio',
            command: 'node',
            args: [ './src/index.js' ], // path to your MCP server
        },
    },
});

// 2. Load the tools from your server
const tools = await client.getTools();

console.log('Available tools:', tools);

// 3. Set up the Mistral model
const model = new ChatOllama({
    model: 'qwen3:4b-instruct',
    temperature: 0,
});

// 4. Create the agent — give it the model and tools
const agent = createAgent({
    model,
    tools,
});

// 5. Ask a question — the agent calls your tools automatically
const result = await agent.invoke({
    messages: [ new HumanMessage('What is the current server time?') ],
});

console.log(result.messages);

client.close();
