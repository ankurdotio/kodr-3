import userModel from "../models/user.model.js";
import followModel from "../models/follow.model.js";
import mongoose from "mongoose";

/**
 * GET /api/users/search?q=abhi
 */

export const searchUser = async (req, res) => {
    const { q } = req.query;

    const users = await userModel.aggregate(
        [
            {
                $search: {
                    index: 'user_search_feature',
                    autocomplete: {
                        query: q,
                        path: 'username'
                    }
                }
            },
            {
                $lookup: {
                    from: 'follows',
                    as: 'followStatus',
                    let: { userId: '$_id' },
                }
            },
            {
                $unwind: {
                    path: '$followStatus',
                    includeArrayIndex: 'string',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    username: '$username',
                    fullname: '$fullname',
                    profilePicture: '$profilePicture',
                    followStatus: '$followStatus.status'
                }
            }
        ])

    res.status(200).json({
        message: "Users fetched successfully",
        users
    })
}

export const followUser = async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const isUserExist = await userModel.findById(userId);


    if (!isUserExist) {
        return res.status(404).json({
            message: "User not found",
            success: false,
        })
    }

    if (userId === currentUserId) {
        return res.status(400).json({
            message: "You cannot follow yourself",
            success: false,
        })
    }

    const alreadyFollowing = await followModel.findOne({
        follower: currentUserId,
        followee: userId
    })

    if (alreadyFollowing) {
        return res.status(400).json({
            message: "You are already following this user",
            success: false,
        })
    }

    const follow = await followModel.create({
        follower: currentUserId,
        followee: userId,
    })

    return res.status(200).json({
        message: "Follow request sent successfully",
        success: true,
        follow
    })
}

