import mongoose, { Schema } from 'mongoose';

// Define the Post schema
const userRoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  
  },
  { timestamps: true }
);

// Export the Post model
export const UserRole = mongoose.model.UserRole || mongoose.model('UserRole', userRoleSchema);