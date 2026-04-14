import { useDispatch } from "react-redux";
import { getChatUsers } from "../services/chat.api.js";
import { setChats, setCurrentChatId, appendMessage } from "../state/chat.slice.js";


export const useChat = () => {
    const dispatch = useDispatch()

    async function handleGetChatUsers() {
        const data = await getChatUsers()

        console.log(data.users)

        dispatch(setChats(data.users))
    }

    function handleSetCurrentChatId(userId) {
        dispatch(setCurrentChatId(userId))
    }

    function handleAppendMessage({ message, receiverId, senderId, currentChatId }) {
        dispatch(appendMessage({ message, receiverId, senderId, currentChatId }))
    }


    return {
        handleGetChatUsers,
        handleSetCurrentChatId,
        handleAppendMessage
    }

}