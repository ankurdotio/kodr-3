import axios from "axios";

export async function register({ username, email, fullname, password }) {

    const response = await axios.post("/api/auth/register", {
        username,
        email,
        fullname,
        password
    }, { withCredentials: true })

    return response.data

}

export async function login({ usernameOrEmail, password }) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEMail = emailRegex.test(usernameOrEmail)
    const payload = { password }

    if (isEMail) {
        payload.email = usernameOrEmail
    } else {
        payload.username = usernameOrEmail
    }

    const response = await axios.post("/api/auth/login", payload, { withCredentials: true })

    return response.data

}


export async function getMe() {

    const response = await axios.get("/api/auth/me", { withCredentials: true })

    const data = response.data

    return data

}

