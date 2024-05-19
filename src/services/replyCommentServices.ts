import { ReplyInput, ReplyModel } from "../model";

export const createreply = async (input: ReplyInput) => {
	return ReplyModel.create(input);
};

export const deleteRepliesByCommentId = async (comment: string) => {
	return ReplyModel.deleteMany({ comment: comment });
};

export const findReplyById = async (replyId: string) => {
	return ReplyModel.findOne({ _id: replyId });
};
