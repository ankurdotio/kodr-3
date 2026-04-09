import { searchUser, followUser, getFollowRequests, acceptFollowRequest, getProfileData } from "../service/user.api";
import { appendRequest, setFollowRequests, acceptFollowRequestState, setProfile } from "../../user.slice"
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

    async function handleGetProfileData() {
        const data = await getProfileData()
        dispatch(setProfile(data.profile))
    }


    return {
        handleSearchUser,
        handleFollowUser,
        handleGetFollowRequests,
        handleAcceptRequest,
        handleGetProfileData
    }

}