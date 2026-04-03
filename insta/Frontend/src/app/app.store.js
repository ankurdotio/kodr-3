import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice"
import postReducer from "../features/posts/posts.slice"
import userReducer from "../features/user.slice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        user: userReducer
    }
})