import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export async function register(req, res) {

    const { username, email, fullname, password } = req.body;

    const existingUser = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (existingUser) {
        return res.status(400).json({
            message: "Username or email already exists",
            success: false,
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = await userModel.create({
        username,
        email,
        fullname,
        password: hashedPassword,
    })

    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        })

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
        }
    })
}