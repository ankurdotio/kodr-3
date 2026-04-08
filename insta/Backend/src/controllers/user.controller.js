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
                    as: 'followDoc',
                    let: { searchUser: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                '$followee',
                                                '$$searchUser'
                                            ]
                                        },
                                        {
                                            $eq: [ '$follower', new mongoose.Types.ObjectId(req.user.id) ]
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    followStatus: {
                        $cond: {
                            if: {
                                $eq: [ { $size: '$followDoc' }, 0 ]
                            },
                            then: 'not-following',
                            else: {
                                $cond: {
                                    if: {
                                        $eq: [
                                            {
                                                $arrayElemAt: [
                                                    '$followDoc.status',
                                                    0
                                                ]
                                            },
                                            'pending'
                                        ]
                                    },
                                    then: 'requested',
                                    else: 'following'
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    username: 1,
                    fullname: 1,
                    profilePicture: 1,
                    followStatus: 1
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


export const getFollowRequests = async (req, res) => {
    const loggedInUserId = req.user.id

    const requests = await followModel.find({
        followee: loggedInUserId,
        status: "pending"
    }).populate("follower", "username profilePicture")

    return res.status(200).json({
        message: "Follow requests fetched successfully",
        success: true,
        requests
    })

}

