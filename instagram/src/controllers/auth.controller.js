import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";



/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @requires username, email, password, fullname in request body
 * @returns {Object} 201 - User registered successfully
 * @returns {Object} 422 - User with this email or username already exists
 * @returns {Object} 500 - Internal server error
 */
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


/**
 * @route GET /api/auth/google/callback
 * @desc Google OAuth callback
 * @access Public
 * @returns {Object} 200 - User logged in successfully
 * @returns {Object} 201 - User registered successfully
 * @returns {Object} 500 - Internal server error
 */
export async function googleCallback(req, res) {
    const { id, displayName, emails, photos } = req.user;

    const isUserExists = await userModel.findOne({
        email: emails[ 0 ].value,
    })

    if (isUserExists) {
        const token = jwt.sign({
            id: isUserExists._id,
        },
            config.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        )

        res.cookie("token", token)

        return res.status(200).json({
            message: "User logged in successfully",
            success: true,
            user: {
                id: isUserExists._id,
                username: isUserExists.username,
                email: isUserExists.email,
                fullname: isUserExists.fullname,
                bio: isUserExists.bio,
                profileImage: isUserExists.profileImage,
                private: isUserExists.private,
            },
        })
    }

    const user = await userModel.create({
        username: emails[ 0 ].value.split("@")[ 0 ],
        email: emails[ 0 ].value,
        fullname: displayName,
        profileImage: photos[ 0 ].value,
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

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 * @requires email, password in request body
 * @returns {Object} 200 - User logged in successfully
 * @returns {Object} 401 - Invalid credentials
 * @returns {Object} 404 - User not found
 * @returns {Object} 500 - Internal server error
 */
export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    if (hashedPassword !== user.password) {
        return res.status(401).json({
            message: "Invalid credentials",
            success: false,
        })
    }

    const token = jwt.sign({
        id: user._id,
    },
        config.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    )

    res.cookie("token", token)

    return res.status(200).json({
        message: "User logged in successfully",
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


/**
 * @route GET /api/auth/me
 * @desc Get current logged in user
 * @access Private
 * @returns {Object} 200 - User fetched successfully
 * @returns {Object} 404 - User not found
 * @returns {Object} 500 - Internal server error
 */
export async function getMe(req, res) {
    const user = await userModel.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
        })
    }

    return res.status(200).json({
        message: "User fetched successfully",
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