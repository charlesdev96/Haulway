import { CommentModel, commentInput } from "../model";

export const createcomment = async (input: commentInput) => {
	return await CommentModel.create(input);
};

export const findCommentById = async (commentId: string) => {
	return await CommentModel.findOne({ _id: commentId });
};
