import { useDispatch } from "react-redux";
import { getChatUsers, getChatMessages } from "../services/chat.api.js";
import { setChats, setCurrentChatId, appendMessage, setMessages } from "../state/chat.slice.js";


export const useChat = () => {
    const dispatch = useDispatch()

    async function handleGetChatUsers() {
        const data = await getChatUsers()

        console.log(data.users)

        dispatch(setChats(data.users))
    }

    async function handleSetCurrentChatId(userId) {
        dispatch(setCurrentChatId(userId))

        const data = await getChatMessages(userId)
        dispatch(setMessages({ userId, messages: data.messages }))

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