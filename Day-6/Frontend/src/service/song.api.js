import axios from "axios"


export async function createSong({ songFile }) {

    const formData = new FormData()
    formData.append("song", songFile)

    const response = await axios.post("http://localhost:3000/api/songs/", formData, {
        withCredentials: true,
    })

    return response.data
}

export async function getSongs() {
    const response = await axios.get("http://localhost:3000/api/songs/", {
        withCredentials: true,
    })

    return response.data
}