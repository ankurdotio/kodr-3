import React, { useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import { useSelector } from 'react-redux'

const Notification = () => {

    const { handleGetFollowRequests } = useUser()
    const followRequests = useSelector(state => state.user.followRequests)

    useEffect(() => {
        handleGetFollowRequests()
    }, [])

    console.log(followRequests)

    return (
        <div>Notification</div>
    )
}

export default Notification