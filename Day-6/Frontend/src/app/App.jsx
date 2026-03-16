import { RouterProvider } from "react-router"
import { router } from "./routes/app.routes"
import { useAuth } from "../hooks/useAuth"
import { useEffect } from "react"

function App() {

  const { handleGetMe, user } = useAuth()

  useEffect(() => {
    handleGetMe()
  },[])
  console.log(user)

  return (

    <RouterProvider router={router} />

  )
}

export default App
