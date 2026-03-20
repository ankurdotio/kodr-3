import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";


export async function register(req, res) {

    const { username, email, password, fullname } = req.body;

    const isUserExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserExists) {
        return res.status(422).json({
            message: "User with this email or username already exists",
            success: false,
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
        fullname,
    })

    const token = jwt.sign({
        id: user._id,
    },
        config.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    )

    res.cookie("token", token)

    return res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            bio: user.bio,
            profileImage: user.profileImage,
            private: user.private,
        },
    })

}