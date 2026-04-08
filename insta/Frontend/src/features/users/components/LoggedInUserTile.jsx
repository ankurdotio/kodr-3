import React from 'react'
import { useSelector } from 'react-redux'

const LoggedInUserTile = () => {

    const user = useSelector(state => state.auth.user)

    console.log(user)

    if (!user) {
        return null
    }

    return (
        <div
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-50 transition-all duration-200 group"
        >
            <img src={user.profilePicture} alt={user.username} className='w-7 h-7 rounded-full' />
            <span className="text-base text-zinc-900 hidden lg:block tracking-wide">{user.username}</span>
        </div>
    )
}

export default LoggedInUserTile