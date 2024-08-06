import { Customer } from "../models/customer.model.js";

const generateAccessAndRefreshToken = async (userId) => {
	try {
		const user = await Customer.findById(userId);
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();

		// here we saved refreshToken in database
		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error) {
		throw new ApiError(
			500,
			"something went wrong while generating refresh or access token"
		);
	}
};

export { generateAccessAndRefreshToken };
