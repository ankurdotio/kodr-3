import React,{useState} from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'

const Register = () => {

    const [ userType, setUserType ] = useState("user")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    
    const {user,loading,handleRegister} = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        await handleRegister({ email, password, userType })
        navigate("/")
    }
    
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md my-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email Address</label>
                        <input 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            type="email" 
                            placeholder="Enter email" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">Password</label>
                        <input 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            type="password" 
                            placeholder="Enter password" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        />
                    </div>
                    
                    <div className="flex items-center gap-6 my-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input onChange={(e)=>{setUserType(e.target.value)}} type="radio" name="userType" value="user" className="w-4 h-4 text-blue-600 focus:ring-blue-500" defaultChecked />
                            <span className="text-gray-700 font-medium">User</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input onChange={(e)=>{setUserType(e.target.value)}} type="radio" name="userType" value="artist" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                            <span className="text-gray-700 font-medium">Artist</span>
                        </label>
                    </div>

                    <button className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition duration-300 mt-2">
                        Register
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600 text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
                </p>
            </div>
        </main>
    )
}

export default Register