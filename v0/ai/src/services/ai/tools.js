import axios from 'axios';
import { z } from 'zod';
import { tool } from "langchain"


export const list_files = tool(async ({ }, config) => {

    const writer = config.writer

    writer("Invoking list_files tool with config: " + JSON.stringify(config))

    console.log("Config in list_files tool:", config)

    console.log("Listing files in sandbox:", config.configurable.sandboxId)


    const response = await axios.get(`http://sandbox-service-${config.configurable.sandboxId}:8080/list-files`)

    return JSON.stringify(response.data.files)
}, {
    name: "list_files",
    description: "Use this tool to List all files in the project.",
    schema: z.object({})
})


/**
 * files: string[] - an array of file paths to read eg. ["src/App.jsx", "vite.config.js"]
 */
export const read_file = tool(async ({ files }, config) => {

    const writer = config.writer

    writer("Invoking read_file tool with config: " + JSON.stringify(config) + " and files: " + JSON.stringify(files))

    console.log("Reading files in sandbox:", config.configurable.sandboxId, files)

    const response = await axios.get(`http://sandbox-service-${config.configurable.sandboxId}:8080/read-files?files=${files.join(',')}`)

    return JSON.stringify(response.data.files)

},
    {
        name: "read_file",
        description: "Use this tool to read files in the project. Input is an array of file paths. Output is an object with file paths as keys and file content as values.",
        schema: z.object({
            files: z.array(z.string()).describe("An array of file paths to read eg. [\"src/App.jsx\", \"vite.config.js\"]")
        })
    }
)


/**
 * files: { path: string, content: string }[] - an array of objects with file path and file content to update/create eg. 
 * [{ path: "src/components/Button.jsx", content: "file content" }]
 */
export const update_file = tool(async ({ files = [] }, config) => {



    const writer = config.writer

    writer("Invoking update_file tool with config: " + JSON.stringify(config) + " and files: " + JSON.stringify(files))
    console.log("Updating files in sandbox:", config.configurable.sandboxId, files)

    const payload = {};
    for (const file of files) {
        payload[ file.path ] = file.content;
    }

    /**
     * payload example:
     * {
     *  "src/components/Button.jsx": "file content",
     *  "vite.config.js": "file content"
     * }
     */

    const response = await axios.post(`http://sandbox-service-${config.configurable.sandboxId}:8080/update-files`, {
        files: payload
    })

    return JSON.stringify(response.data.files)

},
    {
        name: "update_file",
        description: "Use this tool to update/create files in the project. Input is an array of objects with file path and file content to update/create. Output is an object with file paths as keys and file content as values.",
        schema: z.object({
            files: z.array(z.object({
                path: z.string().describe("The path of the file to update/create"),
                content: z.string().describe("The content of the file to update/create")
            }))
        })
    }
)

