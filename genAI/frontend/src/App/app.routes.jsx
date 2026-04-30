import { createBrowserRouter } from "react-router";
import Auth from "../features/auth/pages/Auth";
import Home from "../features/chats/pages/Home";

export const routes = createBrowserRouter([
    {
        path: "/auth",
        element: <Auth />
    },
    {
        path: "/",
        element: <Home />
    }
])