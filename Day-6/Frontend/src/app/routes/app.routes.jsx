import { createBrowserRouter } from 'react-router'
import Register from '../../pages/Register'
import Login from '../../pages/Login'
import Home from '../../pages/Home'
import Upload from '../../pages/Upload'

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
        path: "/upload",
        element: <Upload />
    }
])