import { useState } from 'react'
import { sendMessage } from '../features/chats/services/chat.api'
import './App.css'

function App() {
  const [ message, setMessage ] = useState('')

  const handleSendMessage = async () => {
    await sendMessage(message)
  }

  return (
    <><h1>Chat GPT</h1>
      <input
        type="text"
        placeholder='Enter Message'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </>
  )
}

export default App
