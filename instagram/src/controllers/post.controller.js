import postModel from "../models/post.model.js";
import { uploadFile } from "../services/storage.service.js";


const getMediaType = (file) => {
    if (file.fileType == "image") return "image";
    if (file.videoCodec) return "video";
    throw new Error("Unsupported media type");
}


export async function createPost(req, res) {
    const { caption } = req.body;
    const files = req.files;
    const user = req.user;

    const media = await Promise.all(files.map(file => {
        return uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
        })
    }))

    const post = await postModel.create({
        user: user.id,
        caption,
        media: media.map(m => ({
            url: m.url,
            mediaType: getMediaType(m),
        }))
    })

    return res.status(201).json({
        message: "Post created successfully",
        success: true,
        post,
    })
}

export async function getPosts(req, res) {
    const posts = await postModel.find().populate("user", "username profileImage").sort({ createdAt: -1 });

    return res.status(200).json({
        message: "Posts fetched successfully",
        success: true,
        posts,
    })
}

export async function getPostById(req, res) {
    const { id } = req.params;

    const post = await postModel.findById(id).populate("user", "username profileImage");

    if (!post) {
        return res.status(404).json({
            message: "Post not found",
            success: false,
        })
    }

    return res.status(200).json({
        message: "Post fetched successfully",
        success: true,
        post,
    })
}

export async function updatePost(req, res) {
    const { id } = req.params;
    const { caption, deletedMedia } = req.body;

    const post = await postModel.findById(id);

    if (!post) {
        return res.status(404).json({
            message: "Post not found",
            success: false,
        })
    }

    if (post.user.toString() !== req.user.id) {
        return res.status(403).json({
            message: "You are not the owner of this post",
            success: false,
        })
    }

    post.caption = caption || post.caption;

    if (deletedMedia && deletedMedia.length > 0) {
        post.media = post.media.filter(m => !deletedMedia.includes(m._id.toString()));
    }

    await post.save();

    return res.status(200).json({
        message: "Post updated successfully",
        success: true,
        post,
    })
}