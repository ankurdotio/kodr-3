import axios from "axios"

export async function searchUser({ query }) {

    const response = await axios.get("http://localhost:3000/api/users/search?q=" + query, {
        withCredentials: true
    })
    return response.data

}

export async function followUser({ userId }) {

    const response = await axios.post("http://localhost:3000/api/users/follow/" + userId, {}, {
        withCredentials: true
    })

    return response.data

}