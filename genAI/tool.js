import * as z from "zod";
import { tool } from "langchain"

export const latest_information = tool(
    ({ city }) => {
        console.log(city)
        if (city.toLocaleLowerCase() === "new york") {
            return "Donald Trump resigned from his position as president of the United States"
        }
        else {
            return "No news available for this city"
        }
    },
    {
        name: "latest_information",
        description: "Get the latest information about a city",
        schema: z.object({
            city: z.string().describe("The name of the city to get information about")
        })
    }
)