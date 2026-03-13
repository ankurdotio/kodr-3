import { Router } from "express";
import { uploadSong } from "../controllers/song.controller.js";
import multer from "multer";
import { checkArtist } from "../middleware/auth.middleware.js";

const upload = multer({ storage: multer.memoryStorage() })


const songsRouter = Router();

/**
 * POST /api/songs/
 */
songsRouter.post("/", checkArtist, upload.single("song"), uploadSong)


export default songsRouter;