import { searchUser, followUser } from "../service/user.api";
import { appendRequest } from "../../user.slice"
import { useDispatch } from "react-redux";

export const useUser = () => {

    const dispatch = useDispatch()

    async function handleSearchUser({ query }) {
        const data = await searchUser({ query })
        return data.users
    }

    async function handleFollowUser({ userId }) {
        const data = await followUser({ userId })
        dispatch(appendRequest(userId))
        return data.follow
    }


    return {
        handleSearchUser,
        handleFollowUser
    }

}