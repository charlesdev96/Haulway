import mongoose from "mongoose";

export interface PostInputs {
	content?: string[];
	desc?: string;
	postedBy?: string;
	views?: number;
	numOfLikes?: number;
	numOfComments?: number;
	comments?: string[];
	tagPeople?: string[];
	addLocation?: string;
	addMusic?: string;
	addCategory?:
		| "dinner"
		| "office"
		| "wedding"
		| "pyjamas"
		| "beach"
		| "casual"
		| "sport"
		| "grwm"
		| "lookbook"
		| "hauls"
		| "featured"
		| "jewelry"
		| "cosmetics";
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
		numOfComments: {
			type: Number,
			default: 0,
		},
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

export const PostModel = mongoose.model<PostDocument>("Post", PostSchema);
