import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true,
        maxlength: 2200
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    media: [ {
        url: {
            type: String,
        },
        media_type: {
            type: String,
            enum: [ "image", "video" ]
        }
    } ]
},
    {
        timestamps: true
    }
)

const postModel = mongoose.model("post", postSchema)

export default postModel;
