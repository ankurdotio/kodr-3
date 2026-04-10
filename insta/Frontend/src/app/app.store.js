import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice"
import postReducer from "../features/posts/posts.slice"
import userReducer from "../features/user.slice"
import chatReducer from "../features/chats/state/chat.slice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        user: userReducer,
        chat: chatReducer
    }
})