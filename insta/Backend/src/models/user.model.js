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
    },
    profilePicture: {
        type: String,
        default: "https://ik.imagekit.io/hnoglyswo0/avatar-photo-default-user-icon-600nw-2558759027.webp?updatedAt=1773986129958"
    }
})

userSchema.index({ googleId: 1 }, { sparse: true, unique: true })

const userModel = mongoose.model("user", userSchema)

export default userModel;