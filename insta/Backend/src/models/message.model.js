import mongoose from 'mongoose';


const chatMessageSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }
}, {
    timestamps: true,
})


const ChatMessageModel = mongoose.model("chatmessage", chatMessageSchema);

export default ChatMessageModel;