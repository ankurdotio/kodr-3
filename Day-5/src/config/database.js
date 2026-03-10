import mongoose from "mongoose"
import { config } from "./config.js"

export default async function connectToDB() {

    await mongoose.connect(config.MONGO_URI)

    console.log("Connected to DB")
}