import { PostInputs, PostModel } from "../model";
import { FilterQuery } from "mongoose";

export const createPosts = async (input: PostInputs) => {
	return await PostModel.create(input);
};

export const findPostById = async (_id: string) => {
	return await PostModel.findOne({ _id: _id });
};

export const findPostByUser = async (postedBy: string) => {
	return await PostModel.findOne({ postedBy: postedBy });
};
