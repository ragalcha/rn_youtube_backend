import mongoose, { Schema } from 'mongoose';

const subscriptionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export const Subscription = mongoose.model.Subscription || mongoose.model('Subscription', subscriptionSchema);
