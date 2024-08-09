import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const customerSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},

		userName: {
			type: String,
			required: true,
			unique: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		userRole: {
            type: Schema.Types.ObjectId,
            ref: 'UserRole',  // Reference to the UserRole model
        },
		refreshToken: {
			type: String,
		},
		trialExpiresAt: {
            type: Date,  // To store the start date of the trial
        },
		trialStartedAt: {
            type: Date,  // To store the start date of the trial
        },
        trialActive: {
            type: Boolean,
            default: false,  // To indicate if the trial is currently active
        },
        subscriptionActive: {
            type: Boolean,
            default: false,  // To indicate if the trial is currently active
        },
		subscriptionPlan: {
			type: Schema.Types.ObjectId,
			ref: 'Subscription'
		},
		subscriptionExpiresAt: {
            type: Date,  // To store the start date of the subscription
        },
		subscriptionStartedAt: {
            type: Date,  // To store the start date of the subscription
        }
	},
	{ timestamps: true }
);

customerSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

customerSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password);
};

customerSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			username: this.userName,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};
customerSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		}
	);
};

export const Customer =
	mongoose.model.Customer || mongoose.model("Customer", customerSchema);
