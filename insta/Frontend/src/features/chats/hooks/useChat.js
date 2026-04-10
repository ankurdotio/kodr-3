import { useDispatch } from "react-redux";
import { getChatUsers } from "../services/chat.api.js";
import { setChats } from "../state/chat.slice.js";


export const useChat = () => {
    const dispatch = useDispatch()

    async function handleGetChatUsers() {
        const data = await getChatUsers()

        console.log(data.users)

        dispatch(setChats(data.users))
    }

    return {
        handleGetChatUsers
    }

}