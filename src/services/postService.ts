import { PostInputs, PostModel, CommentModel, ReplyModel } from "../model";
import { Post } from "../types";

export const createPosts = async (input: PostInputs) => {
	return await PostModel.create(input);
};

export const findPostById = async (postId: string) => {
	return await PostModel.findOne({ _id: postId });
};

export const findPostByUser = async (userId: string) => {
	return await PostModel.find({ postedBy: userId }).sort({ updatedAt: -1 });
};

export const deleteCommentByPost = async (postId: string) => {
	return await CommentModel.deleteMany({ post: postId });
};

export const deleteReplyByPost = async (postId: string) => {
	return await ReplyModel.deleteMany({ post: postId });
};

export const timeLinePost = async (userId: string) => {
	const posts = await PostModel.find({})
		.select(
			"_id content caption views numOfLikes numOfComments products createdAt updatedAt numOfPeopleTag addCategory numOfShares",
		)
		.populate({
			path: "postedBy",
			select:
				"_id fullName profilePic userName numOfFollowings numOfFollowers followers",
		})
		.sort({ updatedAt: -1 });
	const postsData: Post[] = (posts || []).map((post: any) => {
		let status = "follow";

		// Check if userId is the owner of the post
		if (post.postedBy._id.toString() === userId.toString()) {
			status = "owner";
		}

		// Check if userId is in the followers array
		if (post.postedBy.followers.includes(userId.toString())) {
			status = "following";
		}
		// Remove the followers field from postedBy
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { followers, ...postedBy } = post.postedBy._doc;
		return { status: status, ...post._doc, postedBy };
	});

	return postsData;
};

export const singlePost = async (postId: string) => {
	// Increment the views by 1
	await PostModel.updateOne({ _id: postId }, { $inc: { views: 1 } });
	return await PostModel.findOne({ _id: postId })
		.select(
			"_id content desc views numOfLikes numOfComments comments products addMusic postedBy createdAt updatedAt tagPeople numOfPeopleTag addLocation addMusic addCategory numOfShares",
		)
		.populate({
			path: "postedBy",
			select:
				"_id fullName profilePic userName numOfFollowings numOfFollowers followers",
		})
		.populate({
			path: "tagPeople",
			select: "_id fullName userName profilePic",
		})
		.populate({
			path: "comments",
			select:
				"_id comment numOfReplies replies createdAt updatedAt commentedBy",
			populate: [
				{
					path: "replies",
					select: "_id reply replier createdAt updatedAt",
					populate: {
						path: "replier",
						select: "_id fullName userName profilePic",
					},
				},
				{
					path: "commentedBy",
					select: "_id fullName userName profilePic",
				},
			],
		})
		.sort({ updatedAt: -1 });
};

// .populate({
// 	path: "comments",
// 	select:
// 		"_id comment numOfReplies replies createdAt updatedAt commentedBy",
// 	populate: [
// 		{
// 			path: "replies",
// 			select: "_id reply replier createdAt updatedAt",
// 			populate: {
// 				path: "replier",
// 				select: "_id fullName userName profilePic",
// 			},
// 		},
// 		{
// 			path: "commentedBy",
// 			select: "_id fullName userName profilePic",
// 		},
// 	],
// })
