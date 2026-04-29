import userModel from "../models/user.model.js";

export async function findUserByEmail(email) {
    const user = await userModel.findOne({ email });
    return user;
}

export async function createUser({ fullname, email }) {
    const newUser = await userModel.create({ fullname, email });
    return newUser;
}