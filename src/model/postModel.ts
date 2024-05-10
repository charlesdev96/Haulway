import mongoose from "mongoose";

export interface PostInputs {
	content: string[];
	desc: string;
	views: number;
	numOfLikes: number;
	numOfComments: number;
	comments: string[];
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
	{ timestamps: true },
);

export const PostModel = mongoose.model<PostDocument>("Post", PostSchema);
