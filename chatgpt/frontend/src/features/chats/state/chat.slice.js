import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: []
    },
    reducers: {
        addMessage: (state, action) => {
            /**
             * action.payload = {
             *   role: "user" | "assistant",
             *   content: "message content",
             *   timestamp: Date.now()
             * }
             */
            state.messages.push(action.payload)
        },
        appendContentToLastMessage: (state, action) => {
            /**
             * action.payload = {
             *   chunk: "new chunk of content to be appended to the last message"
             * }
             */
            state.messages[ state.messages.length - 1 ].content += action.payload.chunk
        }
    }
})


export const { addMessage, appendContentToLastMessage } = chatSlice.actions

export default chatSlice.reducer



/**
 * messages:[
 * {
 *   role: "user" | "assistant",
 *   content: "message content",
 *   timestamp: Date.now()
 * }
 * ]
 */