import { Response } from "express";
import {
	createPostInputs,
	updatePostInputs,
	deletePostInputs,
	getSinglePostInputs,
} from "../schema";
import {
	CustomRequest,
	createPosts,
	findPostById,
	findUserById,
	timeLinePost,
	singlePost,
} from "../services";
import { log } from "../utils";
import { StatusCodes } from "http-status-codes";

export class PostController {
	public async createPost(req: CustomRequest, res: Response) {
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
			const body = req.body as createPostInputs;
			body.postedBy = userId;
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
				.json({ success: false, message: "Unable to create post" });
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
			const posts = await timeLinePost();
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
			const post = await singlePost(postId);
			if (!post) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Post not found" });
			}
			res.status(StatusCodes.OK).json({
				success: true,
				message: "Posts retrieved successfully.",
				data: post,
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
			if (userId.toString() !== post.postedBy?.toString()) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					message:
						"Oops! It looks like you can't edit this post. Only the author can make changes.",
				});
			}
			//then procceds to update the post
			if (body.content) post.content = body.content;
			if (body.desc) post.desc = body.desc;
			//save updated post
			post.save();
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
			//then proceed to delete post
			await post.deleteOne();
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
}
