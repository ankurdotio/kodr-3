import { sendMessage } from "../services/chat.api";
import { appendContentToLastMessage, addMessage } from "../state/chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
    const dispatch = useDispatch()

    const handleSendMessage = async (userInput) => {
        dispatch(addMessage({
            role: "user",
            content: userInput,
            timestamp: Date.now()
        }))
        dispatch(addMessage({
            role: "assistant",
            content: "",
            timestamp: Date.now()
        }))

        sendMessage(userInput, ({ chunk }) => {
            dispatch(appendContentToLastMessage({ chunk }))
        })
    }

    return {
        handleSendMessage
    }

}
