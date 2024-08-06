import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { OPTIONS } from "../constants.js";
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js";


const createCategory = asyncHandler(async (req, res) => {
    // access data from the form-data
    const [title, description  ] = [
        req.body.title,
        req.body.description
    ];
    if (title) {
        try {
            // check user exist or not
            const existingCategory = await Category.findOne({
                title: title,
            }); 

            if (existingCategory) {
                // User with the provided username, email, or phone number already exists
                // Handle the case accordingly, such as returning an error response
                return res
                .status(401)
                .json(
                    new ApiResponse(
                        401,
                        existingCategory,
                        "Category with title already exists"
                    )
                );
            }            
            // create new customer
            const category = new Category({
                title,
                description,
            });
            const result = await category.save();
            const createdCategory = await Category.findById(result._id).select(
                "-password -refreshToken"
            );
            // checking if user created or not
            if (!createdCategory) {
                console.log("category not created");    
                throw new ApiError(
                    500,
                    "category not created",
                    "category not created"
                );
            }
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        createdCategory,
                        "category created successfully"
                    )
                );
        } catch (error) {
            throw new ApiError(500, error.message, "category not created");
        }
    }
})  

const editCategory = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the category ID from the request parameters
    const { title, description } = req.body; // Get the new values from the request body

    try {
        // Find the category by ID
        const category = await Category.findById(id);

        // Check if the category exists
        if (!category) {
            return res.status(404).json(
                new ApiResponse(404, {}, "Category not found")
            );
        }

        // Update the category details
        if (title) category.title = title;
        if (description) category.description = description;

        // Save the updated category
        const updatedCategory = await category.save();

        return res.status(200).json(
            new ApiResponse(200, updatedCategory, "Category updated successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message, "Failed to update category");
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id; // Get the category ID from the request parameters

    try {
        // Find and delete the category
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        // Check if the category was deleted
        if (!deletedCategory) {
            return res.status(404).json(
                new ApiResponse(404, {}, "Category not found")
            );
        }

        // Return response
        return res.status(200).json(
            new ApiResponse(200, deletedCategory, "Category deleted successfully")
        );
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json(
            new ApiResponse(500, {}, "Server error")
        );
    }
});


const getAllCategories = asyncHandler(async (req, res) => {
    try {
        // Fetch all categories from the database
        const categories = await Category.find();

        // Return response
        return res.status(200).json(
            new ApiResponse(200, categories, "Categories fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json(
            new ApiResponse(500, {}, "Server error")
        );
    }
});

export { createCategory, editCategory, deleteCategory, getAllCategories }