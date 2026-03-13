import jwt from "jsonwebtoken"
import { config } from "../config/config.js";

export async function checkArtist(req, res, next) {
    const token = req.cookies.mama

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET)

    if (decoded.userType !== "artist") {
        return res.status(403).json({
            message: "Forbidden",
            success: false,
        })
    }

    req.user = decoded

    next();
}