import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { OPTIONS } from "../constants.js";
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js";
import multer from 'multer';
import path from 'path';
import { io } from "../app.js"; // Import io to use socket.io
import { Category } from "../models/category.model.js";
import { uploadOnCloudinary,deleteFromCloudinary} from "../utils/cloudinary.js";
import { Like } from '../models/like.model.js';
// Create a new post
export const createPost = async (req, res) => {
    const { title, body, postTags, imdbScore } = req.body;
    const userId = req.user._id;

    if (!userId) {
        return res.status(401).json(new ApiResponse(401, {}, 'User not authenticated'));
    }

    let image_url = '';
    let video_url = '';

    if (req.files) {
        if (req.files.image) {
            const imageUploadResponse = await uploadOnCloudinary(req.files.image[0].path);
            //console.log("imageUploadResponse------>", imageUploadResponse);
            if (imageUploadResponse) {
                image_url = imageUploadResponse.url;
            }
        }
        if (req.files.video) {
            const videoUploadResponse = await uploadOnCloudinary(req.files.video[0].path);
            //console.log("videoUploadResponse------>", videoUploadResponse);
            if (videoUploadResponse) {
                video_url = videoUploadResponse.url;
            }
        }
    }
 
    // Parse postTags correctly
    let tagArray;
    try {
        tagArray = JSON.parse(postTags);
    } catch (e) {
        tagArray = postTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    //console.log("tagArray------>", tagArray);

    // Find category IDs
    const categoryIds = await Category.find({ title: { $in: tagArray } }).select('_id');
    //console.log("categoryIds------>", categoryIds);

    // Create array of category IDs
    const categoryIdsArray = categoryIds.map(category => category._id);
    //console.log("categoryIdsArray------>", categoryIdsArray);

    try {
        const post = new Post({
            title,
            body,
            image: image_url,
            video: video_url,
            postTags: tagArray,
            imdbScore,
            author: userId
        });

        await post.save();
        io.emit('newPost', {
            message: 'A new post has been created!',
            post
        });

        return res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
    } catch (error) {
        //console.error("Error creating post:", error);
        return res.status(500).json(new ApiResponse(500, error.message, "Something went wrong"));
    }
};


// Update a post by ID
export const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, body, postTags, imdbScore } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (title) post.title = title;
        if (body) post.body = body;
        if (postTags) {
            // Convert comma-separated tags to an array of Object IDs
            const tagArray = postTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            const categoryIds = await Category.find({ title: { $in: tagArray } }).select('_id');
            post.postTags = categoryIds.map(category => category._id);
        }
        if (imdbScore) post.imdbScore = imdbScore;

        if (req.files) {
            if (req.files.image) {
                const imageUploadResponse = await uploadOnCloudinary(req.files.image[0].path);
                if (imageUploadResponse) {
                    await deleteFromCloudinary(post.image);
                    past.image = imageUploadResponse.url;
                }
            }
            if (req.files.video) {
                const videoUploadResponse = await uploadOnCloudinary(req.files.video[0].path);
                if (videoUploadResponse) {
                    await deleteFromCloudinary(post.video);
                    post.video = videoUploadResponse.url;
                }
            }
        }

        await post.save();

        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    } 
});

// Delete a post by ID
export const deletePost = asyncHandler(async (req, res) => {
    //console.log("req.params----------------->", req.params);
    const { id } = req.params;
    try {
        const post_old = await Post.findById(id);
        const img = post_old.image;
        const vid = post_old.video;
        const post = await Post.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        await deleteFromCloudinary(img);
        await deleteFromCloudinary(vid);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get all posts
export const getPosts = asyncHandler(async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'userName email')
            .populate('postTags', 'title'); // Populate category titles
            // //console.log("all post", posts);
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get a single post by ID
export const getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id)
            .populate('author', 'userName email')
            .populate('postTags', 'title'); // Populate category titles
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ post });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get the three most recent posts
export const getRecentPosts = asyncHandler(async (req, res) => {
    try {
        const recentPosts = await Post.find()
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .limit(3) // Limit the results to 3 posts
            .populate('author', 'userName email')
            .populate('postTags', 'title'); // Populate category titles

        if (recentPosts.length === 0) {
            return res.status(404).json({ message: "No recent posts found" });
        }

        res.status(200).json({ recentPosts });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get all posts by a specific tag ID
export const getPostsByTagId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //console.log("tagId", req.params,id);

    try {
        // Find all posts that have the given tag id
        const posts = await Post.find({ postTags: id })
            .populate('author', 'userName email')
            .populate('postTags', 'title'); // Populate category titles
        
        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this tag" });
        }

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});