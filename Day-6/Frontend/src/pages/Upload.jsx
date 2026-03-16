import React, { useEffect,useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'
import { useSong } from '../hooks/useSong'
import { useNavigate } from 'react-router'


const Upload = () => {

    const { user, handleGetMe,loading } = useAuth()
    const fileInputRef = useRef(null)
    const { handleCreateSong } = useSong()
    const navigate = useNavigate()

    if (user?.userType !== "artist" && !loading) {
        return <Navigate to="/" />
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Handle file upload here
        const file = fileInputRef.current.files[0]
        await handleCreateSong({songFile: file})
        navigate("/")
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload Song</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="song" className="text-sm font-medium text-gray-700">
                            Select Audio File
                        </label>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            id="song"
                            name="song" 
                            accept="audio/*" 
                            required
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Upload Song
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Upload