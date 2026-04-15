import { createBrowserRouter } from "react-router"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import Home from "../features/posts/pages/Home"
import Profile from "../features/users/pages/Profile"
import CreatePost from "../features/posts/pages/CreatePost"
import AppLayout from "../components/layouts/AppLayout"
import Search from "../features/users/pages/Search"
import Notification from "../features/users/pages/Notification"
import Messages from "../features/chats/pages/Messages"
import NotFound from "../features/shared/pages/NotFound"


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
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/create",
                element: <CreatePost />
            },
            {
                path: "/search",
                element: <Search />
            },
            {
                path: "/notifications",
                element: <Notification />
            },
            {
                path: "/messages",
                element: <Messages />
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
])