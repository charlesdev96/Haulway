import { Request, Response } from "express";
import { createPostInputs } from "../schema";
import {
	CustomRequest,
	createPosts,
	findPostById,
	findPostByUser,
	findUserById,
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
			user.posts?.push(post._id);
			await user.save();
			res.status(StatusCodes.CREATED).json({
				success: true,
				message: "Post created successfully!",
				data: post,
			});
		} catch (error: any) {
			log.info(error);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Unable to create post" });
		}
	}
}
