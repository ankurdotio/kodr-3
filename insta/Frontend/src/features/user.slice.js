/**
 * followers
 * following
 * requested
 */

import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: "user",
    initialState: {
        followers: [],
        following: [],
        requested: [],
        followRequests: []
    },
    reducers: {
        setFollowers: (state, action) => {
            state.followers = action.payload
        },
        setFollowing: (state, action) => {
            state.following = action.payload
        },
        setRequested: (state, action) => {
            state.requested = action.payload
        },
        appendRequest: (state, action) => {
            state.requested = [ ...state.requested, action.payload ]
        },
        setFollowRequests: (state, action) => {
            state.followRequests = action.payload
        },
        acceptFollowRequestState: (state, action) => {
            const requestId = action.payload
            state.followRequests = state.followRequests.map(request => {

                if (request._id == requestId) {
                    return {
                        ...request,
                        status: "accepted"
                    }
                }

                return request
            })
        }

    }
})


/**
 * dispatch(acceptFollowRequest(requestId))
 */

/**
 * [user-a,user-b]
 */

export const {
    setFollowers,
    setFollowing,
    setRequested,
    appendRequest,
    setFollowRequests,
    acceptFollowRequestState
} = userSlice.actions

export default userSlice.reducer