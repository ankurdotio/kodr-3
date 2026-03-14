import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import crypto from "crypto";


export async function register(req, res) {

    const { email, password, userType = "user" } = req.body;


    const passwordHash = crypto.createHash("sha256").update(password).digest("hex")

    const user = await userModel.create({
        email,
        password: passwordHash,
        userType
    })

    const token = jwt.sign({
        id: user._id,
        email: user.email,
        userType: user.userType
    }, config.JWT_SECRET, {
        expiresIn: "1h"
    })

    res.cookie("mama", token)

    res.status(201).json({
        message: "User registered successfully",
        user
    })

}

export async function login(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({
        email,
    })

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
        })
    }

    const passwordHash = crypto.createHash("sha256").update(password).digest("hex")

    const isPasswordValid = user.password === passwordHash;


    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password",
            success: false,
        })
    }

    const token = jwt.sign({
        id: user._id,
        email: user.email,
        userType: user.userType
    }, config.JWT_SECRET, {
        expiresIn: "1h"
    })

    res.cookie("mama", token)

    res.status(200).json({
        message: "User logged in successfully",
        user
    })
}

export async function getMe(req, res) {

    const token = req.cookies.mama

    const decoded = jwt.verify(token, config.JWT_SECRET)

    res.status(200).json({
        message: "User fetched successfully",
        user: decoded
    })

}