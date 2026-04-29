import { createBrowserRouter } from "react-router";
import Auth from "../features/pages/Auth";

export const routes = createBrowserRouter([
    {
        path:"/auth",
        element:<Auth />
    }
])