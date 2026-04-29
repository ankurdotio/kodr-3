import jwt from 'jsonwebtoken';
import * as userDao from "../dao/user.dao.js";
import * as utils from "../utils/utils.js";


export async function googleAuthCallback(req, res) {

    const userData = req.user; // The authenticated user from Passport

    let user = await userDao.findUserByEmail(userData.emails[ 0 ].value);

    if (!user) {
        user = await userDao.createUser({
            fullname: userData.displayName,
            email: userData.emails[ 0 ].value,
        });
    }

    const token = utils.generateJWT({
        id: user._id,
        fullname: user.fullname,
    })

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    })

    res.redirect("http://localhost:5173");


}