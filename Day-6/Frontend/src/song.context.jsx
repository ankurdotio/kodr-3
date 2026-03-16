import { createContext,useState } from "react";


export const SongContext = createContext()

export const SongProvider = ({ children }) => {
    const [ songs, setSongs ] = useState([])
    const [currentSong, setCurrentSong] = useState(null)

    return (
        <SongContext.Provider value={{ songs, setSongs, currentSong, setCurrentSong }}>
            { children }
        </SongContext.Provider>
    )
}