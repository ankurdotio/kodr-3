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

export async function login(req, res) {

    const { username, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid username/email or password",
            success: false,
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const isPasswordValid = user.password === hashedPassword

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid username/email or password",
            success: false,
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        })

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
        }
    })
}

export async function getMe(req, res) {

    const user = await userModel.findById(req.user.id)

    return res.status(200).json({
        message: "User profile fetched successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
        }
    })
}

export async function googleAuthCallback(req, res) {

    const { id, displayName, emails: [ { value: email } ] } = req.user;
    /**
     * (ankur@gmail.com).split("@") = [ "ankur", "gmail.com" ]
     */
    const username = email.split("@")[ 0 ]

    const isUserExists = await userModel.findOne({
        $or: [
            { googleId: id },
            { email },
            { username }
        ]
    })

    if (!isUserExists) {
        const user = await userModel.create({
            username,
            email,
            fullname: displayName,
            googleId: id,
        })

        const token = jwt.sign({
            id: user._id,
        }, config.JWT_SECRET,
            {
                expiresIn: "7d"
            })

        res.cookie("token", token)

        return res.status(201).json({
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

    const token = jwt.sign({
        id: isUserExists._id,
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        })

    res.cookie("token", token)

    return res.status(200).json({
        message: "User logged in successfully",
        success: true,
        user: {
            id: isUserExists._id,
            username: isUserExists.username,
            email: isUserExists.email,
            fullname: isUserExists.fullname,
        }
    })

}