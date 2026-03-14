import { RouterProvider } from "react-router"
import { router } from "./routes/app.routes"
import { AuthProvider } from "../auth.context"

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
