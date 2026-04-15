import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null
    },
    reducers: {
        setChats: (state, action) => {
            const users = action.payload
            state.chats = users.reduce((acc, user) => {
                acc[ user._id ] = { ...user, messages: [] }
                return acc
            }, state.chats)
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        appendMessage: (state, action) => {
            const { message, receiverId, senderId, currentChatId } = action.payload

            /**
             * message : hello neha
             * receiver: neha_js
             * sender:"ritu_dev"
             * currentChatId:"ritu_dev"
             */

            console.log(action.payload)

            state.chats[ currentChatId ].messages.push({
                message,
                receiver: receiverId,
                sender: senderId
            })
        },
        setMessages: (state, action) => {
            const { messages, userId } = action.payload
            state.chats[ userId ].messages = messages
        }
    }
})


export const { setChats, setCurrentChatId, appendMessage,setMessages } = chatSlice.actions
export default chatSlice.reducer

// const chats = {
//     "user-1-id": {
//         username: "",
//         profilePicture: "",
//         messages: []
//     },
//     "user-2-id": {
//         username: "",
//         profilePicture: "",
//         messages: []
//     }
// }
