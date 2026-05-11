import { tavily } from "@tavily/core"
import "dotenv/config"

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function search({ query }) {

    console.log("========================================================")
    console.log("using tool with query =>", query)
    console.log("========================================================")
    
    const response = await tvly.search(query, {
        searchDepth: "advanced",
        maxResults: 5,
    })
    
    
    const results = response.results.map(r => r.content)
    
    console.log("========================================================")
    console.log("results =>", results)
    console.log("========================================================")

    
    return results.join("\n\n --- \n\n")

}