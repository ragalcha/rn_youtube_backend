// Middleware to check if the user has an Admin role

import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Customer } from "../models/customer.model.js";
 const isAdmin = asyncHandler(async (req, _, next) => {
    const userDetails  = await Customer.findById(req.user._id).populate('userRole').select(
		"-password -refreshToken"
	);
    if (userDetails && (userDetails.userRole.name === 'Admin' || userDetails?.userRole?.name =='Admin')) {
        next();
    } else {
        return res.status(403).json(
            new ApiResponse(
                403,
                {},
                "Access denied: Admins only"
            )
        );
    }
 });
export { isAdmin };