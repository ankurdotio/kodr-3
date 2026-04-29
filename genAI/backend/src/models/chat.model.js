import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    title: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
})

const chatModel = mongoose.model("chat", chatSchema)

export default chatModel;