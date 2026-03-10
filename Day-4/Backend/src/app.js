/**
 * - server create krna
 * - server ko config krna
 */

import express from "express"
import morgan from "morgan"
import noteModel from "./models/note.model.js"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(cors())


app.post("/notes", async (req, res) => {
    const { title, description } = req.body

    await noteModel.create({
        title: title,
        description: description
    })

    res.status(201).json({
        message: "Note created successfully."
    })
})

app.get('/notes', async (req, res) => {

    const notes = await noteModel.find()

    console.log(notes)

    res.status(200).json({
        message: "Notes fetched successfully.",
        notes
    })

})

/**
 * DELETE /notes/:id
 */

app.delete("/notes/:id", async (req, res) => {

    await noteModel.findByIdAndDelete(req.params.id)

    res.status(200).json({
        message: "note deleted successfully."
    })

})

/**
 * PATCH /notes/:id
 * req.body = {description}
 */
app.patch("/notes/:id", async (req, res) => {

    const id = req.params.id
    const { description } = req.body

    await noteModel.findByIdAndUpdate(id, { description })

    res.status(200).json({
        message: "note updated successfully."
    })

})

/**
 * GET /notes/:id
 * 
 * res => {message,note:{}}
 */




export default app