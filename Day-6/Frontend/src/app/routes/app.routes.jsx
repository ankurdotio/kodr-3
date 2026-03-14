import {createBrowserRouter} from 'react-router'
import Register from '../../pages/Register'
import Login from '../../pages/Login'

export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/",
        element:<h1>Home Page</h1>
    }
])