import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/users/state/user.slice";

const store = configureStore({
    reducer: {
        user: userReducer,
    },
})

export default store