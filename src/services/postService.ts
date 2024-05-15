import { PostInputs, PostModel } from "../model";

export const createPosts = async (input: PostInputs) => {
	return await PostModel.create(input);
};

export const findPostById = async (postId: string) => {
	return await PostModel.findOne({ _id: postId });
};

export const findPostByUser = async (userId: string) => {
	return await PostModel.find({ postedBy: userId }).sort({ updatedAt: -1 });
};

// export const timeLinePost = async (userId: string) => {
// 	const user = await UserModel.findOne({ _id: userId });
// 	const followerIds = user?.followers?.map((follower) => follower);
// 	const followingIds = user?.followings?.map((following) => following);
// 	const userPost = await PostModel.find({ postedBy: userId }).sort({
// 		updatedAt: -1,
// 	});
// };
