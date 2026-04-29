import { config } from "dotenv";
config();


if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    process.exit(1);
}

if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in environment variables");
    process.exit(1);
}

if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("GOOGLE_CLIENT_ID is not defined in environment variables");
    process.exit(1);
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    console.error("GOOGLE_CLIENT_SECRET is not defined in environment variables");
    process.exit(1);
}

if (!process.env.MISTRAL_API_KEY) {
    console.error("MISTRAL_API_KEY is not defined in environment variables");
    process.exit(1);
}


const _config = {
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
}

export default Object.freeze(_config);