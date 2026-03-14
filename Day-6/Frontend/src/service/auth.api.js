import axios from "axios"



export async function registerUser({ email, password, userType }) {
    const response = await axios.post("http://localhost:3000/api/auth/register", {
        email,
        password,
        userType
    },{withCredentials: true})
    return response.data;
}

export async function loginUser({ email, password }) {
    const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password
    }, { withCredentials: true })
    return response.data;
}

export async function getMeUser() {
    const response = await axios.get("http://localhost:3000/api/auth/get-me",{withCredentials: true})
    return response.data
}