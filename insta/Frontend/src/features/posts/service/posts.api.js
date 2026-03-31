import axios from "axios"

export async function getPosts() {
    const response = await axios.get("http://localhost:3000/api/posts", {
        withCredentials: true
    })

    return response.data
}