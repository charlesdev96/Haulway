import mongoose from "mongoose";

export interface PostInputs {
	content?: string[];
	caption?: string;
	postedBy?: string;
	numOfShares?: number;
	views?: number;
	numOfLikes?: number;
	numOfComments?: number;
	comments?: string[];
	likes?: string[];
	options?: "haul" | "lookbook" | "diy" | "grwm";
	tagPeople?: string[] | null;
	products?: string[] | [];
	numOfProducts?: number | 0;
	numOfPeopleTag?: number;
	addCategory?: string[] | null;
}

export interface PostDocument extends PostInputs, mongoose.Document {
	_id?: string;
	createdAt: Date;
	updatedAt: Date;
}

const PostSchema = new mongoose.Schema(
	{
		content: [
			{
				type: String,
				required: true,
			},
		],
		caption: {
			type: String,
		},
		postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		views: {
			type: Number,
			default: 0,
		},
		numOfLikes: {
			type: Number,
			default: 0,
		},
		numOfShares: {
			type: Number,
			default: 0,
		},
		numOfComments: {
			type: Number,
			default: 0,
		},
		numOfPeopleTag: {
			type: Number,
			default: 0,
		},
		options: { type: String, enum: ["haul", "lookbook", "diy", "grwm"] },
		tagPeople: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		products: [{ type: mongoose.Schema.Types.ObjectId, ref: "VendorProduct" }],
		numOfProducts: { type: Number, default: 0 },
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
		addCategory: {
			type: Array,
			default: [],
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

export const PostModel = mongoose.model<PostDocument>("Post", PostSchema);
