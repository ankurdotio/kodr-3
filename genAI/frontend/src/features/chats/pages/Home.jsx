import React, {
    useState
} from 'react'
import { useChat } from '../hooks/useChat'


const Home = () => {

    const { handleGetAIResponse } = useChat()

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
                        chatId: "" //TODO: implement chat id
                    })
                }}
            >Send</button>

        </div>
    )
}

export default Home