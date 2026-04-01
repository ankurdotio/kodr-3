import userModel from "../models/user.model.js";


/**
 * GET /api/users/search?q=abhi
 */

export const searchUser = async (req, res) => {
    const { q } = req.query;

    const users = await userModel.aggregate([
        {
            $search: {
                index: "user_search_feature",
                autocomplete: {
                    query: q,
                    path: "username",
                }
            }
        },
        {
            $project: {
                username: 1,
                fullname: 1,
                profilePicture: 1,
                score: { $meta: "searchScore" }
            }
        }
    ])

    res.status(200).json({
        message: "Users fetched successfully",
        users
    })
}

