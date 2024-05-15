import { PostInputs, PostModel } from "../model";
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

export const timeLinePost = async () => {
	const posts = await PostModel.find({})
		.select(
			"+_id +content +desc +views +numOfLikes +numOfComments +comments +postedBy +createdAt +updatedAt",
		)
		.populate({
			path: "postedBy",
			select:
				"+_id +fullName +profilePic +createdAt +updatedAt +numOfFollowings +numOfFollowers",
		})
		.populate({
			path: "comments",
			select:
				"+_id +comment +numOfReplies +replies +createdAt +updatedAt +commentedBy",
			populate: [
				{
					path: "replies",
					select: "+_id +reply +replier +createdAt +updatedAt",
					populate: {
						path: "replier",
						select: "+_id +fullName +profilePic",
					},
				},
				{
					path: "commentedBy",
					select: "+_id +fullName +profilePic",
				},
			],
		})
		.sort({ updatedAt: -1 });

	const postsData: Post[] = posts.map((post: any) => ({
		_id: post._id,
		content: post.content || null,
		desc: post.desc || null,
		createdAt: post.createdAt || null,
		updatedAt: post.updatedAt || null,
		postedBy: post.postedBy
			? {
					_id: post.postedBy?._id || null,
					fullName: post.postedBy.fullName || null,
					profilePic: post.postedBy.profilePic,
					numOfFollowings: post.postedBy.numOfFollowings,
					numOfFollowers: post.postedBy.numOfFollowers,
				}
			: null,
		views: post.views,
		numOfLikes: post.numOfLikes,
		numOfComments: post.numOfComments,
		comments: post.comments.map((comment: any) => ({
			_id: comment._id || null,
			comment: comment.comment || null,
			post: comment.post || null,
			createdAt: comment.createdAt || null,
			updatedAt: comment.updatedAt || null,
			commentedBy: comment.commentedBy
				? {
						_id: comment.commentedBy?._id || null,
						fullName: comment.commentedBy.fullName || null,
						profilePic: comment.commentedBy.profilePic,
					}
				: null,
			numOfReplies: comment.numOfReplies,
			replies: comment.replies.map((reply: any) => ({
				_id: reply._id || null,
				reply: reply.reply || null,
				comment: reply.comment || null,
				createdAt: reply.createdAt || null,
				updatedAt: reply.updatedAt || null,
				replier: reply.replier
					? {
							_id: reply.replier?._id || null,
							fullName: reply.replier.fullName || null,
							profilePic: reply.replier.profilePic,
						}
					: null,
			})),
		})),
	}));

	return postsData;
};
