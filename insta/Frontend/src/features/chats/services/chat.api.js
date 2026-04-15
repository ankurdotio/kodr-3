import axios from "axios"


export const getChatUsers = async () => {

    const response = await axios.get("http://localhost:3000/api/chats/users", {
        withCredentials: true
    })

    return response.data

}


export const getChatMessages = async (userId) => {
    const response = await axios.get("http://localhost:3000/api/chats/messages/" + userId, {
        withCredentials: true
    })
    return response.data
}