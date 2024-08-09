import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createSubscription = asyncHandler(async (req, res) => {
    const { name, description, price, duration } = req.body;

    try {
        const existingSubscription = await Subscription.findOne({ name });

        if (existingSubscription) {
            return res.status(401).json(
                new ApiResponse(
                    401,
                    existingSubscription,
                    "Subscription with this name already exists"
                )
            );
        }

        const subscription = new Subscription({ name, description, price, duration });
        const result = await subscription.save();
        const createdSubscription = await Subscription.findById(result._id);

        if (!createdSubscription) {
            throw new ApiError(500, "Subscription not created", "Subscription not created");
        }

        return res.status(200).json(
            new ApiResponse(200, createdSubscription, "Subscription created successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message, "Subscription not created");
    }
});

const editSubscription = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, duration } = req.body;

    try {
        const subscription = await Subscription.findById(id);

        if (!subscription) {
            return res.status(404).json(new ApiResponse(404, {}, "Subscription not found"));
        }

        if (name) subscription.name = name;
        if (description) subscription.description = description;
        if (price) subscription.price = price;
        if (duration) subscription.duration = duration;

        const updatedSubscription = await subscription.save();

        return res.status(200).json(
            new ApiResponse(200, updatedSubscription, "Subscription updated successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message, "Failed to update subscription");
    }
});

const deleteSubscription = asyncHandler(async (req, res) => {
    const subscriptionId = req.params.id;

    try {
        const deletedSubscription = await Subscription.findByIdAndDelete(subscriptionId);

        if (!deletedSubscription) {
            return res.status(404).json(new ApiResponse(404, {}, "Subscription not found"));
        }

        return res.status(200).json(
            new ApiResponse(200, deletedSubscription, "Subscription deleted successfully")
        );
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, {}, "Server error"));
    }
});

const getAllSubscriptions = asyncHandler(async (req, res) => {
    try {
        const subscriptions = await Subscription.find();

        return res.status(200).json(
            new ApiResponse(200, subscriptions, "Subscriptions fetched successfully")
        );
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, {}, "Server error"));
    }
});

export { createSubscription, editSubscription, deleteSubscription, getAllSubscriptions };
