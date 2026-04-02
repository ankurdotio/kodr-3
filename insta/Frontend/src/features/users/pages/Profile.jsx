import React from 'react'
import { useSelector } from 'react-redux'


const Profile = () => {

    const user = useSelector((store) => store.auth.user)
    
    return (
        <div>
            <h1>{user?.fullname}</h1>
            <p>{user?.username}</p>
            <p>{user?.email}</p>
        </div>
    )
}

export default Profile