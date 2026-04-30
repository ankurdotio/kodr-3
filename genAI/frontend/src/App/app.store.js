import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../features/chats/state/chat.slice"

export const store = configureStore({
    reducer: {
        chat: chatReducer,
    },
})