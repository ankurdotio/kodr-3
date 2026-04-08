import { searchUser, followUser, getFollowRequests, acceptFollowRequest } from "../service/user.api";
import { appendRequest, setFollowRequests, acceptFollowRequestState } from "../../user.slice"
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

    async function handleGetFollowRequests() {
        const data = await getFollowRequests()
        dispatch(setFollowRequests(data.requests))
    }

    async function handleAcceptRequest({ requestId }) {
        await acceptFollowRequest({ requestId })
        dispatch(acceptFollowRequestState(requestId))
    }


    return {
        handleSearchUser,
        handleFollowUser,
        handleGetFollowRequests,
        handleAcceptRequest
    }

}