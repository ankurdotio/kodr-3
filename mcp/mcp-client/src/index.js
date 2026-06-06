import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod'; // for schema validation


// Create the server — give it a name and version
const server = new McpServer({
    name: 'my-mcp-server',
    version: '1.0.0',
});

// Tool with no required arguments
server.tool(
    'get_server_time',
    'Returns the current server date and time in ISO format',
    {},                           // empty schema — no args needed
    async () => {
        console.log('get_server_time called');
        return {
            content: [ {
                type: 'text',
                text: new Date().toISOString(),
            } ]
        }
    }
);

// Connect via stdio transport (local usage)
const transport = new StdioServerTransport();
await server.connect(transport);