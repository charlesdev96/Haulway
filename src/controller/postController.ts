import { Response } from "express";
import {
	createUserPostInputs,
	updatePostInputs,
	deletePostInputs,
	getSinglePostInputs,
	createVendorPostInputs,
	savePostInputs,
	getPostByOptionInputs,
} from "../schema";
import {
	CustomRequest,
	createPosts,
	findPostById,
	findUserById,
	timeLinePost,
	singlePost,
	deleteCommentByPost,
	deleteReplyByPost,
	getTrendingPosts,
	getPostByOption,
} from "../services";
import { Post } from "../types";
import { log } from "../utils";
import { StatusCodes } from "http-status-codes";
import { ReplyModel, CommentModel } from "../model";

export class PostController {
	public async createUserPost(req: CustomRequest, res: Response) {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}

			const body = req.body as createUserPostInputs;
			body.postedBy = userId;
			body.numOfPeopleTag = body.tagPeople?.length;
			const post = await createPosts(body);
			//push post._id
			await user.posts?.push(post._id);
			user.numOfPosts = user.posts?.length;
			await user.save();
			res.status(StatusCodes.CREATED).json({
				success: true,
				message: "Post created successfully!",
				data: post,
			});
		} catch (error: any) {
			log.info(error.message);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Unable to create user post" });
		}
	}

	public async createVendorPost(req: CustomRequest, res: Response) {
		try {
			const userId = req.user?.userId;
			const body = req.body as createVendorPostInputs;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}

			body.postedBy = userId;
			body.numOfPeopleTag = body.tagPeople?.length;
			body.numOfProducts = body.products?.length;
			const post = await createPosts(body);
			//push post._id
			await user.posts?.push(post._id);
			user.numOfPosts = user.posts?.length;
			await user.save();
			res.status(StatusCodes.CREATED).json({
				success: true,
				message: "Post created successfully!",
				data: post,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to create vendor post due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while creating vendor post",
				});
			}
		}
	}

	public async getAllPost(req: CustomRequest, res: Response) {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			const posts = await timeLinePost(userId);
			res
				.status(StatusCodes.OK)
				.json({ success: true, message: "List of all posts", data: posts });
		} catch (error: any) {
			log.info(error.message);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: `Unable to display all posts: error: ${error.message}`,
			});
		}
	}

	public async getAllTrendingPost(req: CustomRequest, res: Response) {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			const posts = await getTrendingPosts(userId);
			res.status(StatusCodes.OK).json({
				success: true,
				message: "List of all trending posts",
				data: posts,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to get treanding post due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while getting trending post",
				});
			}
		}
	}

	public async savePost(req: CustomRequest, res: Response) {
		try {
			const { postId } = req.params as savePostInputs;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			const post = await findPostById(postId);
			if (!post) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Post not found" });
			}
			//check if user have already saved the post
			const alreadySavedPost = user.savedPosts?.includes(postId.toString());
			if (alreadySavedPost) {
				//if user have already saved the post, remove the saved post
				user.savedPosts = user.savedPosts?.filter(
					(postSaved) => postSaved.toString() !== postId.toString(),
				);
				await user.save();
				return res.status(StatusCodes.OK).json({
					success: true,
					message: "Successfully removed from your saved post collection.",
				});
			} else {
				//procced to save post
				await user.savedPosts?.push(postId);
				await user.save();
				res.status(StatusCodes.OK).json({
					success: true,
					message: "Post successfully saved to your profile",
				});
			}
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to save post due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while saving post",
				});
			}
		}
	}

	public async getSinglePost(req: CustomRequest, res: Response) {
		try {
			const { postId } = req.params as getSinglePostInputs;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			const singlepost = await singlePost(postId);
			if (!singlepost) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Post not found" });
			}
			//convert object post to array so that we can map it
			const updatedPost = [singlepost];
			const postsData: Post[] = (updatedPost || []).map((post: any) => {
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

			res.status(StatusCodes.OK).json({
				success: true,
				message: "Posts retrieved successfully.",
				data: postsData,
			});
		} catch (error: any) {
			log.info(error.message);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: `Unable to display all posts: error: ${error.message}`,
			});
		}
	}

	public async updatePost(req: CustomRequest, res: Response) {
		try {
			const userId = req.user?.userId;
			const { postId } = req.params as updatePostInputs["params"];
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const body = req.body as updatePostInputs["body"];
			const post = await findPostById(postId);
			//check if post exist
			if (!post) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Post not found" });
			}

			//check if post belongs to user
			// if (userId.toString() !== post.postedBy?.toString()) {
			// 	return res.status(StatusCodes.UNAUTHORIZED).json({
			// 		message:
			// 			"Oops! It looks like you can't edit this post. Only the author can make changes.",
			// 	});
			// }
			//then procceds to update the post
			if (body.content) post.content = body.content;
			if (body.thumbNail) post.thumbNail = body.thumbNail;
			if (body.caption) post.caption = body.caption;
			if (body.options) post.options = body.options;
			if (body.addCategory) post.addCategory = body.addCategory;
			if (body.tagPeople) {
				post.tagPeople = body.tagPeople;
				post.numOfPeopleTag = body.tagPeople.length;
			}
			if (body.products) {
				post.products = body.products;
				post.numOfProducts = body.products.length;
			}
			//save updated post
			await post.save();
			res
				.status(StatusCodes.OK)
				.json({ suceess: true, message: "Your post has been updated." });
		} catch (error: any) {
			log.info(error.message);
			if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
				return res.json({ message: "Wrong Id format" });
			}
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				error: error.message,
				message: "Unable to update post.",
			});
		}
	}

	public async deletePost(req: CustomRequest, res: Response) {
		try {
			const { postId } = req.params as deletePostInputs;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			const post = await findPostById(postId);
			if (!post) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Post not found" });
			}

			//check if post belongs to user
			if (userId.toString() !== post.postedBy?.toString()) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					message:
						"Oops! It looks like you can't delete this post. Only the author can delete this post.",
				});
			}
			//remove postId from list of user's post
			user.posts = user.posts?.filter(
				(postIds: { toString: () => string }) =>
					postIds.toString() !== postId.toString(),
			);
			//reduce number of user's posts
			user.numOfPosts = user.posts?.length;
			await user.save();
			//delete comments associated with post
			const comment = await CommentModel.find({ post: postId });
			if (!comment) {
				//then proceed to delete post
				await post.deleteOne();
			} else {
				await deleteCommentByPost(postId);
				//then proceed to delete replies
				const reply = await ReplyModel.find({ post: postId });
				if (reply.length > 0) {
					//then delete replies
					await deleteReplyByPost(postId);
					await post.deleteOne();
				} else {
					//if no replies, delete post
					await post.deleteOne();
				}
			}

			res.status(StatusCodes.OK).json({
				success: true,
				message: "Your post has been deleted successfully.",
			});
		} catch (error: any) {
			log.info(error.message);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: `Unable to delete post due to error: ${error.message}`,
			});
		}
	}

	public async postByOption(req: CustomRequest, res: Response) {
		try {
			const { option } = req.query as getPostByOptionInputs;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			const posts = await getPostByOption(option, userId);
			res.status(StatusCodes.OK).json({
				success: true,
				message: `List of ${option} posts`,
				data: posts,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to get posts by options due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while getting posts by options",
				});
			}
		}
	}
}
