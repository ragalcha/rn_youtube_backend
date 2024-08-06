import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    }
}, { timestamps: true });

export const Like = mongoose.model.Like || mongoose.model('Like', likeSchema);