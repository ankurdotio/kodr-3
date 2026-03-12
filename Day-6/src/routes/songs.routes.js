import { Router } from "express";
import { uploadSong } from "../controllers/song.controller.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() })


const songsRouter = Router();

/**
 * POST /api/songs/
 */
songsRouter.post("/", upload.single("song"), uploadSong)


export default songsRouter;