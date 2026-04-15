import axios from "axios"

export async function getPosts() {
    const response = await axios.get("/api/posts", {
        withCredentials: true
    })

    return response.data
}


export async function createPost({ files, caption }) {

    const formData = new FormData()
    formData.append("caption", caption)
    Array.from(files).forEach((file) => {
        formData.append("media", file)
    })

    const response = await axios.post("/api/posts/", formData, { withCredentials: true })

    return response.data

}