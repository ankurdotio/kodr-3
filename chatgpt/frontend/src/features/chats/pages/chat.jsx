import React, { useState } from 'react'
import { useChat } from '../hooks/useChat'
import { useSelector } from 'react-redux'

const Chat = () => {

    const [ userInput, setUserInput ] = useState("")

    const { handleSendMessage } = useChat()

    function handleClick() {
        handleSendMessage(userInput)
    }

    const messages = useSelector(state => state.chat.messages)

    return (
        <section>
            <input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                type="text" placeholder='Enter message' />
            <button
                onClick={handleClick}
            >Send</button>

            {
                messages.map((message, index) => (
                    <div key={index} style={{ textAlign: message.role === "user" ? "right" : "left" }}>
                        <p>{message.content}</p>
                    </div>
                ))
            }
        </section>
    )
}

export default Chat