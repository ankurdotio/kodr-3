import mongoose from 'mongoose';

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    followee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: [ 'pending', 'accept', 'reject' ],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can't follow the same user multiple times
followSchema.index({ follower: 1, followee: 1 }, { unique: true });

const Follow = mongoose.model('Follow', followSchema);

export default Follow;
