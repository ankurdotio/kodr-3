import { createBrowserRouter } from 'react-router'
import Chat from '../features/chats/pages/Chat'


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Chat />
    }
])