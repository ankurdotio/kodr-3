import { register } from "../service/auth.api";
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

    return {
        handleRegister,
    }

}