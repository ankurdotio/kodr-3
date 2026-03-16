import { uploadFile } from "../services/storage.service.js";
import songModel from "../models/songs.model.js";
import id3 from "node-id3"

export async function uploadSong(req, res) {

    console.log(req.body)
    console.log(req.file)

    const { id } = req.user

    const { title, artist, image } = id3.read(req.file.buffer)
    const fileResult = await uploadFile(req.file.buffer, req.file.originalname)
    const imageFileResult = await uploadFile(image.imageBuffer, req.file.originalname + ".jpg")


    const song = await songModel.create({
        title,
        artist,
        url: fileResult.url,
        posterUrl: imageFileResult.url,
        user: id
    })


    res.status(201).json({
        message: "Song uploaded successfully",
        song
    });

}

export async function getSongs(req, res) {
    const songs = await songModel.find()

    res.status(200).json({
        message: "Songs fetched successfully",
        songs
    })
}