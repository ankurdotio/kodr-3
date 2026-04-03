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
        requested: []
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
        }

    }
})

/**
 * [user-a,user-b]
 */

export const { setFollowers, setFollowing, setRequested, appendRequest } = userSlice.actions
export default userSlice.reducer