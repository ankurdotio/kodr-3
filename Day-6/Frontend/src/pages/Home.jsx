import React, { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useSong } from '../hooks/useSong'


const Home = () => {
    const { user,handleGetMe } = useAuth()
    const { songs, handleGetSongs,currentSong,setCurrentSong } = useSong()

    console.log(songs)

    useEffect(() => {
        handleGetSongs()
    }, [])

    return (
        <div className="p-6 bg-gray-50 min-h-screen pb-24">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">All Songs</h1>
            
            {songs && songs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {songs.map((song) => (
                        <div 
                            key={song._id} 
                            onClick={() => setCurrentSong(song)}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer"
                        >
                            <img 
                                src={song.posterUrl} 
                                alt={song.title} 
                                className="w-full h-48 object-cover bg-gray-200"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Cover' }}
                            />
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-lg font-semibold text-gray-800 truncate" title={song.title}>
                                    {song.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4 truncate" title={song.artist}>
                                    {song.artist}
                                </p>
                            </div>
                        </div>      
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-10">
                    <p>No songs available right now. Check back later!</p>
                </div>
            )}

            {currentSong && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center gap-4 z-50">
                    <img 
                        src={currentSong.posterUrl} 
                        alt={currentSong.title} 
                        className="w-16 h-16 rounded object-cover" 
                    />
                    <div className="flex-1 w-48">
                        <h4 className="font-semibold text-gray-800 truncate">{currentSong.title}</h4>
                        <p className="text-sm text-gray-500 truncate">{currentSong.artist}</p>
                    </div>
                    <div className="flex-grow max-w-2xl px-4">
                        <audio 
                            controls 
                            autoPlay 
                            src={currentSong.url} 
                            className="w-full h-10 outline-none"
                        >
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home