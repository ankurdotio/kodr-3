import { register, login, getMe } from "../service/auth.api";
import { setUser } from "../auth.slice";
import { useDispatch } from "react-redux";


export const useAuth = () => {

    const dispatch = useDispatch()

    async function handleRegister({
        username,
        email,
        fullname,
        password
    }) {
        const data = await register({
            username,
            email,
            fullname,
            password
        })

        dispatch(setUser(data.user))

    }

    async function handleLogin({ usernameOrEmail, password }) {

        const data = await login({ usernameOrEmail, password })

        dispatch(setUser(data.user))

        return data
    }

    async function handleGetMe() {
        const data = await getMe()
        dispatch(setUser(data.user))
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
    }

}