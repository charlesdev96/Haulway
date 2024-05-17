import mongoose from "mongoose";

export interface PostInputs {
	content?: string[];
	desc?: string;
	postedBy?: string;
	numOfShares?: number;
	views?: number;
	numOfLikes?: number;
	numOfComments?: number;
	comments?: string[];
	likes?: string[];
	tagPeople?: string[] | null;
	numOfPeopleTag?: number;
	addLocation?: { [key: string]: any } | string | null;
	addMusic?: string | null;
	addCategory?: string[] | null;
	products?: string[] | null;
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
		desc: {
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
		tagPeople: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
		addMusic: {
			type: String,
			default: null,
		},
		addCategory: {
			type: Array,
			default: [],
		},
		products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
		addLocation: {
			type: mongoose.Schema.Types.Mixed,
			default: null,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

export const PostModel = mongoose.model<PostDocument>("Post", PostSchema);
