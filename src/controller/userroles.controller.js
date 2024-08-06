import { asyncHandler } from "../utils/asyncHandler.js";
import { UserRole } from "../models/userrole.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a new user role
const createUserRoles = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    try {
        const newRole = new UserRole({ name, description });
        const savedRole = await newRole.save();
        return res.status(201).json(
            new ApiResponse(
                201,
                savedRole,
                "User role created successfully"
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ApiError(400, error.message)
        );
    }
});

// Update a user role
const editUserRoles = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const updatedRole = await UserRole.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updatedRole) {
            return res.status(404).json(
                new ApiResponse(404, {}, "User role not found")
            );
        }
        return res.status(200).json(
            new ApiResponse(
                200,
                updatedRole,
                "User role updated successfully"
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ApiError(400, error.message)
        );
    }
});

// Delete a user role
const deleteUserRoles = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRole = await UserRole.findByIdAndDelete(id);
        if (!deletedRole) {
            return res.status(404).json(
                new ApiResponse(404, {}, "User role not found")
            );
        }
        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "User role deleted successfully"
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ApiError(400, error.message)
        );
    }
});

// Fetch all user roles
const getAllRoles = asyncHandler(async (req, res) => {
    try {
        const roles = await UserRole.find();
        return res.status(200).json(
            new ApiResponse(
                200,
                { roles },
                "All user roles fetched successfully"
            )
        );
    } catch (error) {
        return res.status(500).json(
            new ApiError(500, error.message)
        );
    }
});

export { createUserRoles, editUserRoles, deleteUserRoles, getAllRoles };