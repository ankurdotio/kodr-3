import axios from 'axios'
import { useEffect, useState } from 'react'


function App() {

  const [ user, setUser ] = useState(null)

  const fetchUser = async () => {
    const response = await axios.get("/api/data")
    setUser(response.data.user)
  }

  useEffect(() => { 
    fetchUser()
  }, [])

  return (
    <div>
      <h1>User Profile</h1>
      {user && (
        <div>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
          <img src={user.profilePicture} alt="Profile Picture" />
        </div>
      )}
    </div>
  )
}

export default App
