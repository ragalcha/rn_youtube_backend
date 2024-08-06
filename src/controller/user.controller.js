import { asyncHandler } from "../utils/asyncHandler.js";
import { Customer } from "../models/customer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { OPTIONS } from "../constants.js";
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js";

// register user controller post request api/v1/user/register
const registerUser = asyncHandler(async (req, res) => {
	// access data from the form-data
	const [firstName, lastName, userName, email, password] = [
		req.body.firstName,
		req.body.lastName,
		req.body.userName,
		req.body.email,
		req.body.password,
	];
    console.log(firstName, lastName, userName, email, password);
	if (firstName && lastName && userName && email && password) {
		try {
			// check user exist or not
			const existingUser = await Customer.findOne({
				$or: [
					{ userName: userName },
					{ email: email },
				],
			});

			if (existingUser) {
				// User with the provided username, email, or phone number already exists
				// Handle the case accordingly, such as returning an error response
				return res
				.status(401)
				.json(
					new ApiResponse(
						401,
						existingUser,
						"User with email or username or phone already exists"
					)
				);
			}

			// create new customer
			const customer = new Customer({
				firstName,
				lastName,
				userName,
				email,
				password,
			});
			const result = await customer.save();
			const createdUser = await Customer.findById(result._id).select(
				"-password -refreshToken"
			);

			// checking if user created or not
			if (!createdUser) {
				console.log("user not created");	
				throw new ApiError(
					500,
					"Something went wrong while registering the user"
				);
			}

			// return res
			return res
				.status(201)
				.json(
					new ApiResponse(
						200,
						createdUser,
						"User Registered Successfully"
					)
				);
		} catch (error) {
			throw new ApiError(400, error.message);
		}
	} else {
		return res
				.status(401)
				.json(
					new ApiResponse(
						401,
						 "",
						"All field are required"
					)
				);
	}
});

const loginUser = asyncHandler(async (req, res) => {
	// take data
	const { email, userName, password } = req.body;
   console.log("i am email-->",email,req.body.email);
   console.log("i am user name-->",userName,req.body.userName);
   console.log("i am password-->",password,req.body.password);
// 	// username or email
	if (!userName && !email) {
		console.log("username or email is required");
		return res
		.status(401)
		.json(
			new ApiResponse(
				401,
				"",
				"Username or email is required"
			)
		);
	}

	// check whether user exist in customer database or not
	const user = await Customer.findOne({
		$or: [{ email }, { userName }],
	});

	if (!user) {
		return res
		.status(401)
		.json(
			new ApiResponse(
				401,
				"",
				"Invalid user credentials: user not exit"
			)
		);
	}
	// check if password correct or not
	const isPasswordValid = await user.isPasswordCorrect(password);
	if (!isPasswordValid) {
		return res
		.status(401)
		.json(
			new ApiResponse(
				401,
				"",
				"Invalid user credentials: wrong password"
			)
		);
	}

	// access token and refresh token
	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
		user._id
	);
	const loggedInUser = await Customer.findById(user._id).populate('userRole').select(
		"-password -refreshToken"
	);

	const allDetails = [loggedInUser];



	// if user is seller then send data of both customer and seller if not then send data of customer only
	return res
		.status(200)
		.cookie("accessToken", accessToken, OPTIONS)
		.cookie("refreshToken", refreshToken, OPTIONS)
		.json(
			new ApiResponse(
				200,
				{
					user: allDetails,
					accessToken,
					refreshToken,
				},
				"User logged in successfully"
			)
		);
});

const logoutUser = asyncHandler(async (req, res) => {
	// here we removed refresh token from the database
	console.log("logout processing ------------------->");
	await Customer.findByIdAndUpdate(
		req.user._id,
		{
			$unset: {
				refreshToken: 1, // this removes the field from document
			},
		},
		{
			new: true,
		}
	);

	// here we cleared tokens from cookies
	console.log("user logout successfully");
	return res
		.status(200)
		.clearCookie("accessToken", OPTIONS)
		.clearCookie("refreshToken", OPTIONS)
		.json(new ApiResponse(200, {}, "User logged out"));
});

const getUserBYId = asyncHandler(async (req, res) => {
	try {
        const userId = req.params.id; // Get the user ID from the request parameters
        // Find the user in the database by ID
        const user = await Customer.findById(userId).populate('userRole');;
        // Check if the user was found
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Respond with the user details
        return res.status(200).json(
			new ApiResponse(
				200,
				{
					user: user,
				},
				"User Fetched Successfully"
			)
		);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
})
// update user controller put request api/v1/user/update/:id
// Update user with role
const updateUser = asyncHandler(async (req, res) => {
    const userId = req.params.id; // Get the user ID from the request parameters
    const { firstName, lastName, userName, email, password, userRole } = req.body;
    try {
        // Find the user by ID
		console.log("user id-->", firstName, lastName, userName, email, password, userRole,"req.body",req.body);
        const user = await Customer.findById(userId).populate('userRole');

        // Check if the user exists
        if (!user) {
            return res.status(404).json(
                new ApiResponse(404, {}, "User not found")
            );
        }

        // Update user details
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (userName) user.userName = userName;
        if (email) user.email = email;
        if (password) user.password = password; // Ensure you hash the password before saving
        if (userRole) user.userRole = userRole; // Update user role

        // Save updated user
        const updatedUser = await user.save();

        // Return response
        return res.status(200).json(
            new ApiResponse(
                200,
                { user: updatedUser },
                "User updated successfully"
            )
        );
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json(
            new ApiResponse(500, {}, "Server error")
        );
    }
});
// Fetch all customers
const getAllCustomers = asyncHandler(async (req, res) => {
    try {
        const customers = await Customer.find().populate('userRole'); // Populate userRole field
        return res.status(200).json(
            new ApiResponse(
                200,
                { customers },
                "All customers fetched successfully"
            )
        );
    } catch (error) {
        console.error("Error fetching customers:", error);
        return res.status(500).json(
            new ApiResponse(500, {}, "Server error")
        );
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    try {
        // Find and delete the user by ID
        const user = await Customer.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json(new ApiResponse(404, {}, "User not found"));
        }

        return res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json(new ApiResponse(500, {}, "Server error"));
    }
});

export { registerUser, loginUser, logoutUser, getUserBYId, updateUser, getAllCustomers,deleteUser };


