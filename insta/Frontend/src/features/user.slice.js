/**
 * followers
 * following
 * requested
 */

import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: "user",

    /**
     * `followers`:array of user ids that are following the loggedInUser
     * `following`:array of user ids that the loggedInUser is following
     * `requested`:array of user ids that the loggedInUser has requested to follow
     * `followRequests`:array of user objects that have requested to follow the loggedInUser
     * `profile`:object with properties postsCount,posts,followersCount,followingCount of loggedInUser
     */
    initialState: {
        followers: [],
        following: [],
        requested: [],
        followRequests: [],
        profile: null
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
        },
        setProfile: (state, action) => {
            state.profile = action.payload
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
    acceptFollowRequestState,
    setProfile
} = userSlice.actions

export default userSlice.reducer