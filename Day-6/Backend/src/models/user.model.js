import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    userType: {
        type: String,
        enum: [ "user", "artist" ],
        default: "user"
    }
})

const userModel = mongoose.model("users", userSchema)

export default userModel;