import {Like} from '../models/like.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Like a video
export const likeVideo = async (req, res) => {
    const { videoId } = req.params;
    console.log("i am here",req.params);
    const userId = req.user._id; // Assuming user ID is stored in req.user
    console.log("video , and user id ",videoId, userId);
    try {
        // Check if the video is already liked
        const existingLike = await Like.findOne({ user: userId, video: videoId });

        if (existingLike) {
            return res.status(400).json(new ApiResponse(400, {}, 'You have already liked this video.'));
        }

        // Create a new like
        const newLike = new Like({ user: userId, video: videoId });
        await newLike.save();

        res.status(201).json(new ApiResponse(201, newLike, 'Video liked successfully.'));
    } catch (error) {
        console.error('Error liking video:', error);
        res.status(500).json(new ApiResponse(500, {}, 'Failed to like video.'));
    }
};

// Unlike a video
export const unlikeVideo = async (req, res) => {
    const { likeId } = req.params;
     console.log("like id ", likeId);

    try {
        // Find and remove the like
        const deletedLike = await Like.findByIdAndDelete(likeId);

        if (!deletedLike) {
            return res.status(404).json(new ApiResponse(404, {}, 'Like not found.'));
        }

        res.status(200).json(new ApiResponse(200, deletedLike, 'Video unliked successfully.'));
    } catch (error) {
        console.error('Error unliking video:', error);
        res.status(500).json(new ApiResponse(500, {}, 'Failed to unlike video.'));
    }
};

// Fetch liked videos by user ID
export const getLikedVideosByUser = async (req, res) => {
    const userId = req.user._id; // Assuming user ID is stored in req.user

    try {
        // Find all likes for the user and populate the video details
        const likedVideos = await Like.find({ user: userId }).populate({
            path: 'video',
            populate: {
                path: 'postTags', // Populate the postTags field in the video
                model: 'Category' // Assuming your Category model is named 'Category'
            }
        });

        if (!likedVideos.length) {
            return res.status(404).json(new ApiResponse(404, {}, 'No liked videos found.'));
        }

        res.status(200).json(new ApiResponse(200, likedVideos, 'Liked videos fetched successfully.'));
    } catch (error) {
        console.error('Error fetching liked videos:', error);
        res.status(500).json(new ApiResponse(500, {}, 'Failed to fetch liked videos.'));
    }
};
