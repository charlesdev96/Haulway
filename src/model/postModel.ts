import mongoose from "mongoose";

export interface PostInputs {
	content?: string[];
	desc?: string;
	postedBy?: string;
	views?: number;
	followingStatus?: "following" | "follow" | "owner";
	numOfLikes?: number;
	numOfComments?: number;
	comments?: string[];
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
		followingStatus: {
			type: String,
			enum: ["owner", "following", "follow"],
			default: "owner",
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
	{ timestamps: true },
);

export const PostModel = mongoose.model<PostDocument>("Post", PostSchema);
