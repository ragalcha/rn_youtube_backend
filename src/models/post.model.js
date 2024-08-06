  import mongoose, { Schema } from 'mongoose';

  // Define the Post schema
  const postSchema = new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      body: {
        type: String,
        required: true,
      },
      image: {
        type: String, // Store the URL or path of the image
        required: true,
      },
      video: {
        type: String, // Store the URL or path of the video
        required: true,
      },
      postTags: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      }], // Reference to Category documents
      imdbScore: {
        type: Number,
        required: true,
      },
      author: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
      },
    },
    { timestamps: true }
  );

  // Export the Post model
  export const Post = mongoose.model.Post || mongoose.model('Post', postSchema);
