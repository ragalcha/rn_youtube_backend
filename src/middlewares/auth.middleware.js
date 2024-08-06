import jwt from "jsonwebtoken";
import { Customer } from "../models/customer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
	try {
		// this token is encrypted
		// console.log("i am token01-->", req.cookies);
		const token =
			req.cookies?.accessToken ||
			req.header("Authorization")?.replace("Bearer ", "") || req.body?.headers?.Authorization?.replace("Bearer ", "");
        //  console.log("req.heders",req.header("Authorization"),req.header);
		if (!token) {
			throw new ApiError(401, "Unauthorized request");
		} else if (typeof token !== "string") {
			throw new ApiError(401, "Invalid token format");
		}

		// token decoded
		const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

		// to unserstand this see what payload we are sending in jwt.sign method in generateRefreshToken in Customer model
		const user = await Customer.findById(decodedToken?._id).select(
			"-password -refreshToken"
		);

		if (!user) {
			throw new ApiError(401, "Invalid Access Token");
		}

		req.user = user;

		next();
	} catch (error) {
		throw new ApiError(401, error?.message || "Invalid Access Token");
	}
});

export { verifyJWT };
