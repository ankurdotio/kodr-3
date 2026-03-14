import mongoose from "mongoose";
import { config } from "./config.js";

export const connectToDB = () => {

    mongoose.connect(config.MONGO_URI)
        .then(() => {
            console.log("Connected to MongoDB");
        })

}