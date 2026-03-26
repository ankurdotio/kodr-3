import { createBrowserRouter } from "react-router"
import { Login } from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import Home from "../features/posts/pages/Home"
import Profile from "../features/posts/pages/Profile"


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/profile",
        element: <Profile />
    }
])