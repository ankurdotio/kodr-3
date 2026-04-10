import React from 'react'

const ChatUserTile = ({ user }) => {
    return (
        <div className="flex items-center gap-2">
            <img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full" />
            <p>{user.username}</p>
        </div>
    )
}

export default ChatUserTile