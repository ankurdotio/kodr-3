import { getAiResponse } from "../services/chat.api";
import {
    setChats,
    appendMessage,
    appendTempMessage,
    appendTempMessageContent,
    setTempChat,
    setChatFromTempChat
} from "../state/chat.slice"
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()

    async function handleGetAIResponse({ message, chatId }) {

        console.log("chatId", chatId)
        if (!chatId) {
            dispatch(appendTempMessage({
                role: "user",
                content: message,
                timestamp: Date.now()
            }))
            dispatch(appendTempMessage({
                role: "ai",
                content: "",
                timestamp: Date.now()
            }))
        }

        await getAiResponse({
            message, chatId,
            onContent: (content) => {
                dispatch(appendTempMessageContent({ index: 1, content }))
            },
            onChat: (chat) => {
                dispatch(setTempChat({ chat }))
            },
            onComplete: () => {
                dispatch(setChatFromTempChat())
            }
        })
    }

    return {
        handleGetAIResponse
    }

}