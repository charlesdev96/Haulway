import { ReplyInput, ReplyModel } from "../model";

export const createreply = async (input: ReplyInput) => {
	return ReplyModel.create(input);
};
