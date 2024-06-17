import { CommentModel, commentInput } from "../model";

export const createcomment = async (input: commentInput) => {
	return await CommentModel.create(input);
};

export const findCommentById = async (commentId: string) => {
	return await CommentModel.findOne({ _id: commentId });
};

export const getAllCommentsByPostId = async (postId: string) => {
	return await CommentModel.find({ post: postId })
		.select("_id comment commentedBy numOfReplies createdAt updatedAt")
		.populate({
			path: "commentedBy",
			select: "_id fullName profilePic",
		})
		.populate({
			path: "replies",
			select: "_id reply replier createdAt updatedAt",
			populate: {
				path: "replier",
				select: "_id fullName profilePic",
			},
		});
};
