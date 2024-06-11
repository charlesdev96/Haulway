import mongoose, { Date } from "mongoose";
import { hashSync, genSalt } from "bcryptjs";

export interface UserInputs {
	stripe_id?: string | null;
	stripe_url?: string | null;
	fullName?: string;
	userName?: string;
	password?: string;
	email?: string;
	profilePic?: string;
	verified?: boolean;
	profileViews?: number;
	numOfPosts?: number;
	deviceType?: "android" | "ios";
	otp?: number | null;
	role?: "user" | "influencer" | "vendor" | "admin" | "tutor";
	posts?: string[];
	address?: string[];
	numOfFollowers?: number;
	numOfFollowings?: number;
	followers?: string[];
	followings?: string[];
	carts?: string[];
	orderHistory?: string[];
	numOfProducts?: number;
	products?: string[];
	influencerPro?: string[];
	productsDelivered?: string[];
	contracts?: string[];
	requests?: string[] | [];
	savedPosts?: string[] | [];
	store?: string;
	productsSold?: string[];
}

export interface UserDocument extends UserInputs, mongoose.Document {
	_id?: string;
	createdAt: Date;
	updatedAt: Date;
	otpExpirationDate?: Date | null;
}

const UserSchema = new mongoose.Schema(
	{
		profilePic: {
			type: String,
			default: "",
		},
		stripe_id: {
			type: String,
			default: null,
		},
		stripe_url: {
			type: String,
			default: null,
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
		numOfProducts: {
			type: Number,
			default: 0,
		},
		profileViews: {
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
			default: null,
		},
		otpExpirationDate: { type: Date, default: null },
		posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
		savedPosts: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "Post", default: [] },
		],
		address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
		products: [{ type: mongoose.Schema.Types.ObjectId, ref: "VendorProduct" }],
		influencerPro: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "InfluencerProduct" },
		],
		store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
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
		contracts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contract" }],
		requests: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "Contract", default: [] },
		],
		orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
		productsDelivered: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "VendorProduct" },
		],
		productsSold: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "VendorProduct" },
		],
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
