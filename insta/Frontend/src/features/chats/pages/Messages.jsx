import React, { useEffect, useRef, useState } from 'react'
import { useChat } from '../hooks/useChat'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client';
import ChatUserTile from '../components/ChatUserTile'


const URL = 'http://localhost:3000';



const Messages = () => {
    const { handleGetChatUsers } = useChat()
    const chats = useSelector(store => store.chat.chats)
    const currentChatId = useSelector(store => store.chat.currentChatId)
    const [ message, setMessage ] = useState("")
    const socketRef = useRef(null)



    function handleSendMessage() {
        socketRef.current.emit("send_message", {
            message,
        })
    }



    useEffect(() => {
        const socket = io(URL, {
            withCredentials: true
        })
        socketRef.current = socket
        handleGetChatUsers()
    }, [])

    const chatUsers = Object.values(chats)

    return (
        <div className="flex flex-col-reverse w-full md:flex-row h-screen bg-[#f9f9f9] text-[#2d3435] font-sans">
            {/* Chat Interface - Left */}
            <div className="flex-1 md:w-3/4 flex flex-col h-full overflow-hidden">
                <div className="flex-1 bg-[#ffffff] shadow-[0_24px_48px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-[#f2f4f4]/60">
                        <h2 className="text-2xl tracking-tight font-medium text-[#2d3435]">Chat</h2>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-[#5a6061] text-sm tracking-wide">Select a user from the right to start a conversation</p>
                        </div>
                    </div>

                    {/* Input Area placeholder */}
                    {currentChatId && (
                        <div className="p-6 bg-[#f2f4f4]/40 flex gap-2">
                            <div className="bg-[#ffffff] rounded-full px-6 py-4 border border-[#adb3b4]/20 flex grow items-center transition-all focus-within:ring-1 focus-within:ring-[#5e5e5e]/50">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="w-full text-sm outline-none bg-transparent placeholder:text-[#adb3b4] text-[#2d3435]"
                                    value={message}
                                    onChange={(e) => { setMessage(e.target.value) }}
                                />
                            </div>

                            <button
                                onClick={handleSendMessage}
                                className="mt-2 px-4 py-2 bg-[#0095f6] text-white rounded-full hover:bg-[#0077cc] transition-colors"
                            >
                                Send
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Users List - Right */}
            <div className="w-full md:w-[320px] lg:w-95 bg-[#f2f4f4] shrink-0 h-[35vh] md:h-full overflow-y-auto p-6 md:p-8 border-l border-[#dde4e5]/30">
                <div className="mb-8 flex items-center justify-between">
                    <h3 className="text-xs font-bold tracking-widest text-[#5a6061] uppercase">Conversations</h3>
                </div>
                <div className="flex flex-col space-y-1 mt-2">
                    {chatUsers.length > 0 ? chatUsers.map(user => (
                        <ChatUserTile key={user._id} user={user} />
                    )) : (
                        <p className="text-[#5a6061] text-sm mt-4">No conversations</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Messages