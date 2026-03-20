import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: '',
      maxlength: 2200,
    },
    media: [
      {
        url: {
          type: String,
          required: true,
        },
        mediaType: {
          type: String,
          enum: [ 'image', 'video' ],
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentNumber: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
