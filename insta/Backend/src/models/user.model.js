import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId; // Password is required if googleId is not present
        }
    },
    googleId: {
        type: String,
        unique: true,
    }
})

const userModel = mongoose.model("user", userSchema)

export default userModel;