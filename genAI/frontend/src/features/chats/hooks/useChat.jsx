import { getAiResponse } from "../services/chat.api";

export const useChat = () => {


    async function handleGetAIResponse({ message, chatId }) {
        await getAiResponse({ message, chatId })
    }

    return {
        handleGetAIResponse
    }

}