import { createSong, getSongs } from "../service/song.api";
import { useContext } from "react";
import { SongContext } from "../song.context.jsx";

export const useSong = () => {

    const { songs, setSongs, currentSong, setCurrentSong } = useContext(SongContext)

    async function handleCreateSong({ songFile }) {
        const data = await createSong({ songFile })
        return data
    }

    async function handleGetSongs() {
        const data = await getSongs()
        setSongs(data.songs)
    }

    return {
        handleCreateSong,
        songs,
        handleGetSongs,
        currentSong,
        setCurrentSong
    }

}