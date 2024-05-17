import { PostInputs, PostModel } from "../model";
import { Post, location } from "../types";

export const createPosts = async (input: PostInputs) => {
	return await PostModel.create(input);
};

export const findPostById = async (postId: string) => {
	return await PostModel.findOne({ _id: postId });
};

export const findPostByUser = async (userId: string) => {
	return await PostModel.find({ postedBy: userId }).sort({ updatedAt: -1 });
};

export const timeLinePost = async (userId: string) => {
	const posts = await PostModel.find({})
		.select(
			"+_id +content +desc +views +numOfLikes +numOfComments +comments +products +addMusic +postedBy +createdAt +updatedAt +tagPeople +numOfPeopleTag +addLocation +addMusic +addCategory +numOfShares",
		)
		.populate({
			path: "postedBy",
			select:
				"+_id +fullName +profilePic +createdAt +updatedAt +numOfFollowings +numOfFollowers +followers",
		})
		.populate({
			path: "tagPeople",
			select: "+_id +fullName +profilePic",
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

		return {
			_id: post._id,
			status: status,
			content: post.content || null,
			desc: post.desc || null,
			views: post.views,
			numOfShares: post.numOfShares,
			numOfLikes: post.numOfLikes,
			numOfComments: post.numOfComments,
			numOfPeopleTag: post.numOfPeopleTag,
			addLocation: post.addLocation || location || {},
			addMusic: post.addMusic || "" || null,
			addCategory: post.addCategory || [] || null,
			createdAt: post.createdAt || null,
			updatedAt: post.updatedAt || null,
			postedBy: post.postedBy
				? {
						_id: post.postedBy?._id || null,
						fullName: post.postedBy.fullName || null,
						profilePic: post.postedBy.profilePic || "",
						numOfFollowings: post.postedBy.numOfFollowings,
						numOfFollowers: post.postedBy.numOfFollowers,
					}
				: {},
			tagPeople: (post.tagPeople || []).map((people: any) => ({
				_id: people._id || null,
				fullName: people.fullName || null,
				profilePic: people.profilePic || "",
			})),
			products: post.products || [],
			comments: (post.comments || []).map((comment: any) => ({
				_id: comment._id || null,
				comment: comment.comment || null,
				post: comment.post || null,
				createdAt: comment.createdAt || null,
				updatedAt: comment.updatedAt || null,
				commentedBy: comment.commentedBy
					? {
							_id: comment.commentedBy?._id || null,
							fullName: comment.commentedBy.fullName || "",
							profilePic: comment.commentedBy.profilePic,
						}
					: {},
				numOfReplies: comment.numOfReplies,
				replies: (comment.replies || []).map((reply: any) => ({
					_id: reply._id || null,
					reply: reply.reply || null,
					comment: reply.comment || null,
					createdAt: reply.createdAt || null,
					updatedAt: reply.updatedAt || null,
					replier: reply.replier
						? {
								_id: reply.replier?._id || null,
								fullName: reply.replier.fullName || null,
								profilePic: reply.replier.profilePic || "",
							}
						: {},
				})),
			})),
		};
	});

	return postsData;
};

export const singlePost = async (postId: string) => {
	const post = await PostModel.findOne({ _id: postId })
		.select(
			"+_id +content +desc +views +numOfLikes +numOfComments +comments +products +addMusic +postedBy +createdAt +updatedAt +tagPeople +numOfPeopleTag +addLocation +addMusic +addCategory +numOfShares",
		)
		.populate({
			path: "postedBy",
			select:
				"+_id +fullName +profilePic +createdAt +updatedAt +numOfFollowings +numOfFollowers +followers",
		})
		.populate({
			path: "tagPeople",
			select: "+_id +fullName +profilePic",
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
	return post;
};
