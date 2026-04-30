import chatModel from "../models/chat.model.js";



export async function createChat({ title, user }) {
    const chat = await chatModel.create({ title, user })
    return chat;
}