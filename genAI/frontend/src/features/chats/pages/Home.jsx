import React, {
    useState
} from 'react'
import { useChat } from '../hooks/useChat'
import { useSelector } from 'react-redux'

const Home = () => {

    const { handleGetAIResponse } = useChat()
    const tempMessages = useSelector((state) => state.chat.tempMessages)
    const currentChatId = useSelector((state) => state.chat.currentChatId)
    const chats = useSelector((state) => state.chat.chats)
    const currentChat = chats[ currentChatId ]

    const [ message, setMessage ] = useState("")

    return (
        <div>

            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text" placeholder='Enter message' />
            <button
                onClick={() => {
                    handleGetAIResponse({
                        message,
                        chatId: null //TODO: implement chat id
                    })
                }}
            >Send</button>

            {/* <h1 style={{ color: "red" }} >Temp message</h1> */}
            {
                tempMessages.map((message) => (
                    <div key={message.timestamp}>
                        <p>{message.role}</p>
                        <p>{message.content}</p>
                    </div>
                ))
            }
            {/* <h1 style={{ color: "red" }} >actual chat message</h1> */}
            {
                currentChat?.messages.map((message) => (
                    <div key={message.timestamp}>
                        <p>{message.role}</p>
                        <p>{message.content}</p>
                    </div>
                ))
            }

        </div>
    )
}

export default Home