import { useState, useEffect } from 'react';
import './App.css'
import { connectSocket, addListener, emitEvent } from '../service/app.socket';

function App() {
  const [ messages, setMessages ] = useState([]);
  const [ inputValue, setInputValue ] = useState("");

  const handleSend = (e) => {
    e.preventDefault();

    setMessages(prev => [ ...prev, { id: Date.now(), text: inputValue, isIncoming: false } ])
    emitEvent("hero", inputValue)

    setInputValue("");
  };

  useEffect(() => {
    connectSocket();
    addListener("message", msg => {
      setMessages(prev => [ ...prev, { id: Date.now(), text: msg, isIncoming: true } ])
    })
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">Chat Interface</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isIncoming ? "justify-start" : "justify-end"
              }`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-5 py-2.5 ${message.isIncoming
                ? "bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100"
                : "bg-blue-600 text-white rounded-br-none shadow-sm"
                }`}
            >
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </main>

      <footer className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-100 border-none rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 font-semibold transition-colors shadow-sm"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  )
}

export default App
