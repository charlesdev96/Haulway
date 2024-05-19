import mongoose, { Date } from "mongoose";
import { hashSync, genSalt } from "bcryptjs";

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
	numOfFollowers?: number;
	numOfFollowings?: number;
	followers?: string[];
	followings?: string[];
	carts?: string[];
	orderHistory?: string[];
	products?: string[];
	productsDelivered?: { [key: string]: any }[];
	contracts?: string[];
	store?: string;
	productsSold?: string[];
}

export interface UserDocument extends UserInputs, mongoose.Document {
	_id?: string;
	otpExpirationDate?: string;
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
			type: String,
		},
		posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
		address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
		products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
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
		orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
		productsDelivered: [
			{
				product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
				details: { type: mongoose.Schema.Types.Mixed },
			},
		],
		productsSold: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
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
// export const UserModel = (role: string) => {
// 	switch (role) {
// 		case "vendor":
// 			return mongoose.model<VendorDocument>("User", UserSchema);
// 		case "influencer":
// 			return mongoose.model<InfluencerDocument>("User", UserSchema);
// 		default:
// 			return mongoose.model<UserDocument>("User", UserSchema);
// 	}
// };
