import { config } from "dotenv"

config()

if (!process.env.MISTRAL_API_KEY) {
    throw new Error("MISTRAL_API_KEY is not set")
    process.exit(1)
}


export default {
    mistralApiKey: process.env.MISTRAL_API_KEY,
}