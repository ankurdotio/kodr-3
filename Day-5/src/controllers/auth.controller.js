import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"

export async function register(req, res) {
    const { email, password } = req.body

    const user = await userModel.create({
        email, password
    })

    const token = jwt.sign(
        {
            email: user.email,
            id: user._id
        },
        "2c6392160069885b2bc475947435bf0a"
    )

    res.status(201).json({
        message: "user created successfully",
        token: token
    })

}

export async function getMe(req, res) {
    const { token } = req.body

    const decoded = jwt.verify(token, "2c6392160069885b2bc475947435bf0a")

    res.status(200).json({
        message: "user data read successfully.",
        user: decoded
    })
}