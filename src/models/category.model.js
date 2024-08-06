import mongoose, { Schema } from 'mongoose';

// Define the Post schema
const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    }
  },
  { timestamps: true }
);

// Export the Post model
export const Category = mongoose.model.Category || mongoose.model('Category', categorySchema);
