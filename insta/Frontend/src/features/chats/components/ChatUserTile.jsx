import React from 'react'
import { useChat } from '../hooks/useChat'

const ChatUserTile = ({ user, actAs = "tile" }) => {

    const { handleSetCurrentChatId } = useChat()

    function handleClick(userId) {
        handleSetCurrentChatId(userId)
    }

    return (
        <button onClick={() => { handleClick(user._id) }} className={"flex items-center p-3 -mx-3 rounded-lg transition-colors cursor-pointer group" + (actAs == "tile" ? " hover:bg-[#dde4e5]" : "")}>
            <div className="relative shrink-0">
                <img
                    src={user.profilePicture || "https://ik.imagekit.io/hnoglyswo0/avatar-photo-default-user-icon-600nw-2558759027.webp"}
                    alt={user.username}
                    className="w-11 h-11 rounded-full object-cover shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                />
            </div>
            <div className="ml-4 truncate">
                <p className="text-sm font-semibold tracking-tight text-[#2d3435] truncate">{user.username}</p>
                {actAs == "tile" && <p className="text-xs text-[#5a6061] mt-0.5 truncate">Tap to view chat</p>}
            </div>
        </button>
    )
}

export default ChatUserTile