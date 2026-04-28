import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {

    try {
        await mongoose.connect(config.MONGO_URI,)
        console.log("Connected to DB")
    } catch (error) {
        console.log("Error connecting to DB", error)
        process.exit(1);
    }

}

export default connectDB;