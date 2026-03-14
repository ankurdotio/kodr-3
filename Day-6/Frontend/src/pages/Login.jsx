import React from 'react'
import { Link } from 'react-router'

const Login = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>
            <form className="flex flex-col gap-4">
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email Address</label>
                    <input 
                        id="email"
                        type="email" 
                        placeholder="Enter email" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">Password</label>
                    <input 
                        id="password"
                        type="password" 
                        placeholder="Enter password" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    />
                </div>
                <button className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition duration-300 mt-2">
                    Login
                </button>
            </form>
            <p className="mt-6 text-center text-gray-600 text-sm">
                Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register</Link>
            </p>
        </div>
    </main>
  )
}

export default Login