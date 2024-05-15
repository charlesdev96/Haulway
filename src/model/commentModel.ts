import mongoose from "mongoose";

export interface commentInput {
	comment?: string;
	commentedBy?: string;
	post?: string;
	replies?: string[];
	numOfReplies?: number;
}

export interface CommentDocument extends commentInput, mongoose.Document {
	_id?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const CommentSchema = new mongoose.Schema(
	{
		comment: {
			type: String,
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
		commentedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		numOfReplies: {
			type: Number,
			default: 0,
		},
		replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

export const CommentModel = mongoose.model<CommentDocument>(
	"Comment",
	CommentSchema,
);
