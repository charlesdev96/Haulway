import mongoose from "mongoose";

export interface ReplyInput {
	reply?: string;
	comment?: string;
	replier?: string;
	post?: string;
}

export interface ReplyDocument extends ReplyInput, mongoose.Document {
	_id?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const ReplySchema = new mongoose.Schema(
	{
		reply: { type: String },
		comment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
		replier: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

export const ReplyModel = mongoose.model<ReplyDocument>("Reply", ReplySchema);
