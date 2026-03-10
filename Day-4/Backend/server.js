/**
 *  - server ko start krna
 *  - server aur db ko connect krna
 */

import "dotenv/config"
import app from "./src/app.js"
import mongoose from "mongoose"


async function connectToDB() {
    try {
        await mongoose.connect("mongodb+srv://server:A0JDOZ6veVXaimPj@cluster0.avcnyk1.mongodb.net/day-3")
        console.log("server is connected to DB")
    } catch (error) {
        console.error("DB connection error:", error)
        process.exit(1)
    }
}

connectToDB()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})