import followModel from "../models/follow.model.js";


export const getUsers = async (req, res) => {

    const loggedInUserId = req.user.id;

    const users = await followModel.find({
        $or: [
            { followee: loggedInUserId },
            { follower: loggedInUserId }
        ],
        status: 'accepted'
    }).populate("follower followee", "username profilePicture")

    return res.status(200).json({
        message: "Users fetched successfully",
        success: true,
        users
    })

}