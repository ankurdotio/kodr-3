import axios from "axios";

export async function register({ username, email, fullname, password }) {

    const response = await axios.post("http://localhost:3000/api/auth/register", {
        username,
        email,
        fullname,
        password
    }, { withCredentials: true })

    return response.data

}