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


export async function getFollowRequests() {

    const response = await axios.get("http://localhost:3000/api/users/follow-requests", {
        withCredentials: true
    })

    return response.data

}

export async function acceptFollowRequest({ requestId }) {
    const response = await axios.patch("http://localhost:3000/api/users/follow-requests/" + requestId, {}, {
        withCredentials: true
    })

    return response.data
}

export async function getProfileData() {
    const response = await axios.get("http://localhost:3000/api/users/profile", { withCredentials: true })

    return response.data
}