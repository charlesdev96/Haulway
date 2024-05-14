import mongoose, { Date } from "mongoose";
import { hashSync, genSalt, compare } from "bcryptjs";

export interface UserInputs {
	fullName?: string;
	userName?: string;
	password?: string;
	email?: string;
	profilePic?: string;
	verified?: boolean;
	numOfPosts?: number;
	deviceType?: "android" | "ios";
	otp?: number | null;
	role?: "user" | "influencer" | "vendor" | "admin" | "tutor";
	posts?: string[];
	address?: string[];
	products?: string[];
	store?: string[];
	numOfFollowers?: number;
	numOfFollowings?: number;
	followers?: string[];
	followings?: string[];
	carts?: string[];
}

export interface UserDocument extends UserInputs, mongoose.Document {
	_id?: string;
	otpExpirationDate?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new mongoose.Schema(
	{
		profilePic: {
			type: String,
			default: "",
		},
		fullName: {
			type: String,
			required: [true, "Please provide full name"],
		},
		userName: {
			type: String,
			default: "",
		},
		password: {
			type: String,
			required: [true, "Please provide full name"],
			min: 6,
		},
		email: {
			type: String,
			required: [true, "Please provide email address"],
			unique: true,
		},
		role: {
			type: String,
			enum: ["user", "influencer", "vendor", "admin", "tutor"],
			default: "user",
		},
		verified: {
			type: Boolean,
			default: false,
		},
		numOfPosts: {
			type: Number,
			default: 0,
		},
		deviceType: {
			type: String,
			enum: ["android", "ios"],
			default: "android",
		},
		otp: {
			type: Number,
		},
		otpExpirationDate: {
			type: Date,
		},
		posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
		address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
		products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
		store: [{ type: mongoose.Schema.Types.ObjectId, ref: "Store" }],
		numOfFollowers: {
			type: Number,
			default: 0,
		},
		numOfFollowings: {
			type: Number,
			default: 0,
		},
		followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		carts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
	},
	{ timestamps: true },
);

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return;
	const salt = await genSalt(10);
	this.password = await hashSync(this.password, salt);
	next();
});

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
