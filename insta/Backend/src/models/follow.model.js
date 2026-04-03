import mongoose from 'mongoose';


const followSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    followee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        enum: [ 'pending', 'accepted' ],
        default: 'pending'
    }
}, {
    timestamps: true
})

followSchema.index({ follower: 1, followee: 1 }, { unique: true })

export default mongoose.model('follow', followSchema)