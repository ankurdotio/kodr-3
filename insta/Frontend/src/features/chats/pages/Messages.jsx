
import React, { useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import { useSelector } from 'react-redux'
import ChatUserTile from '../components/ChatUserTile'

const Messages = () => {
    const { handleGetChatUsers } = useChat()
    const chats = useSelector(store => store.chat.chats)

    console.log(chats)

    useEffect(() => {
        handleGetChatUsers()
    }, [])

    const chatUsers = Object.values(chats)

    if (chatUsers.length == 0) {
        return null
    }

    return (
        <div className="flex h-screen">
            <div className="w-1/4 border-r border-gray-200">
                {chatUsers.map((chat) => (
                    <ChatUserTile key={chat._id} user={chat.followee} />
                ))}
            </div>
            <div className="w-3/4">
                {/* Chat messages will go here */}
            </div>
        </div>
    )
}

export default Messages