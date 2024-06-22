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
			"_id content caption thumbNail views numOfLikes numOfComments products createdAt updatedAt numOfPeopleTag addCategory numOfShares likes",
		)
		.populate({
			path: "postedBy",
			select:
				"_id fullName profilePic userName numOfFollowings numOfFollowers followers savedPosts",
		})
		.populate({
			path: "products",
			select: "_id genInfo productPrice productReview store",
			populate: {
				path: "store",
				select: "_id storeName storeLogo",
			},
		})
		.sort({ updatedAt: -1 });
	const postsData: Post[] = (posts || []).map((post: any) => {
		let status = "follow";
		let liked = false;
		let savedBeore = false;

		// Check if userId is the owner of the post
		if (post.postedBy._id.toString() === userId.toString()) {
			status = "owner";
		}

		// Check if userId is in the followers array
		if (post.postedBy.followers.includes(userId.toString())) {
			status = "following";
		}
		//check if user have already liked a post
		if (post.likes.includes(userId.toString())) {
			liked = true;
		}
		//check if user have already saved the post
		if (post.postedBy.savedPosts.includes(post._id.toString())) {
			savedBeore = true;
		}
		// Remove the followers field from postedBy
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { followers, savedPosts, ...postedBy } = post.postedBy._doc;
		//remove likes field
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { likes, ...postData } = post.toObject();
		return {
			status: status,
			liked: liked,
			savedBeore: savedBeore,
			...postData,
			postedBy,
		};
	});

	return postsData;
};

export const getTrendingPosts = async (userId: string) => {
	const posts = await PostModel.find({})
		.select(
			"_id content caption views thumbNail numOfLikes numOfComments products createdAt updatedAt numOfPeopleTag addCategory numOfShares likes",
		)
		.populate({
			path: "postedBy",
			select:
				"_id fullName profilePic userName numOfFollowings numOfFollowers followers savedPosts",
		})
		.populate({
			path: "products",
			select: "_id genInfo productPrice productReview store",
			populate: {
				path: "store",
				select: "_id storeName storeLogo",
			},
		})
		.sort({ views: -1, numOfLikes: -1, numOfComments: -1, numOfShares: -1 });
	const postsData: Post[] = (posts || []).map((post: any) => {
		let status = "follow";
		let liked = false;
		let savedBeore = false;

		// Check if userId is the owner of the post
		if (post.postedBy._id.toString() === userId.toString()) {
			status = "owner";
		}

		// Check if userId is in the followers array
		if (post.postedBy.followers.includes(userId.toString())) {
			status = "following";
		}
		//check if user have already liked a post
		if (post.likes.includes(userId.toString())) {
			liked = true;
		}
		//check if user have already saved the post
		if (post.postedBy.savedPosts.includes(post._id.toString())) {
			savedBeore = true;
		}
		// Remove the followers field from postedBy
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { followers, savedPosts, ...postedBy } = post.postedBy._doc;
		//remove likes field
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { likes, ...postData } = post.toObject();

		return {
			status: status,
			liked: liked,
			savedBeore: savedBeore,
			...postData,
			postedBy,
		};
	});

	return postsData;
};

export const singlePost = async (postId: string) => {
	// Increment the views by 1
	await PostModel.updateOne({ _id: postId }, { $inc: { views: 1 } });
	return await PostModel.findOne({ _id: postId })
		.select(
			"_id content caption postedBy thumbNail numOfShares views numOfLikes numOfComments options products numOfProducts numOfPeopleTag addCategory",
		)
		.populate({
			path: "postedBy",
			select:
				"_id fullName profilePic userName numOfFollowings numOfFollowers followers",
		})
		.populate({
			path: "products",
			select: "_id genInfo productPrice productReview store reviews",
			populate: [
				{
					path: "store",
					select: "_id storeName storeLogo",
				},
				{
					path: "reviews",
					select: "_id comment rating reviewer createdAt updatedAt",
					populate: {
						path: "reviewer",
						select: "_id fullName profilePic userName",
					},
				},
			],
		});
};

export const getPostByOption = async (options: string, userId: string) => {
	const posts = await PostModel.find({ options: options })
		.select(
			"_id content caption views thumbNail numOfLikes numOfComments products createdAt updatedAt numOfPeopleTag addCategory numOfShares likes",
		)
		.populate({
			path: "postedBy",
			select:
				"_id fullName profilePic userName numOfFollowings numOfFollowers followers savedPosts",
		})
		.populate({
			path: "products",
			select: "_id genInfo productPrice productReview store",
			populate: {
				path: "store",
				select: "_id storeName storeLogo",
			},
		})
		.sort({ updatedAt: -1 });
	const postsData: Post[] = (posts || []).map((post: any) => {
		let status = "follow";
		let liked = false;
		let savedBeore = false;

		// Check if userId is the owner of the post
		if (post.postedBy._id.toString() === userId.toString()) {
			status = "owner";
		}

		// Check if userId is in the followers array
		if (post.postedBy.followers.includes(userId.toString())) {
			status = "following";
		}
		//check if user have already liked a post
		if (post.likes.includes(userId.toString())) {
			liked = true;
		}
		//check if user have already saved the post
		if (post.postedBy.savedPosts.includes(post._id.toString())) {
			savedBeore = true;
		}
		// Remove the followers field from postedBy
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { followers, savedPosts, ...postedBy } = post.postedBy._doc;
		//remove likes field
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { likes, ...postData } = post.toObject();

		return {
			status: status,
			liked: liked,
			savedBeore: savedBeore,
			...postData,
			postedBy,
		};
	});

	return postsData;
};
