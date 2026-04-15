import mongoose from "mongoose";
import followModel from "../models/follow.model.js";
import ChatMessageModel from "../models/message.model.js";


export const getUsers = async (req, res) => {

    const loggedInUserId = req.user.id;

    const users = await followModel.aggregate(
        [
            {
                $match: {
                    $or: [
                        { followee: new mongoose.Types.ObjectId(loggedInUserId) },
                        { follower: new mongoose.Types.ObjectId(loggedInUserId) }
                    ],
                    status: 'accepted'
                }
            },
            {
                $addFields: {
                    user: {
                        $cond: {
                            if: {
                                $eq: [ '$follower', new mongoose.Types.ObjectId(loggedInUserId) ]
                            },
                            then: '$followee',
                            else: '$follower'
                        }
                    }
                }
            },
            { $project: { user: 1 } },
            {
                $group: {
                    _id: '$user',
                    user: { $first: '$$ROOT' }
                }
            },
            {
                $project: {
                    _id: '$user._id',
                    user: '$user.user'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: '$user._id',
                    username: '$user.username',
                    profilePicture: '$user.profilePicture'
                }
            }
        ]
    );

    console.log(users)

    return res.status(200).json({
        message: "Users fetched successfully",
        success: true,
        users
    })

}

export const getMessages = async (req, res) => {

    const canChat = await followModel.findOne({
        $or: [
            {
                follower: req.user.id,
                followee: req.params.userId,
            },
            {
                followee: req.user.id,
                follower: req.params.userId,
            }
        ],
        status: "accepted",
    })

    if (!canChat) {
        return res.status(403).json({
            message: "You are not allowed to chat with this user",
            success: false,
        })
    }

    const messages = await ChatMessageModel.find({
        $or: [
            {
                sender: req.user.id,
                receiver: req.params.userId
            },
            {
                receiver: req.user.id,
                sender: req.params.userId
            }
        ]
    })

    return res.status(200).json({
        message: "Messages fetched successfully",
        success: true,
        messages,
    })

}