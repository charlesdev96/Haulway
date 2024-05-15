import { Response } from "express";
import { createCommentInputs } from "../schema";
import {
	CustomRequest,
	findUserById,
	findPostById,
	createcomment,
} from "../services";
import { StatusCodes } from "http-status-codes";
import { log } from "../utils";

export class CommentController {
	public async createComment(req: CustomRequest, res: Response) {
		try {
			const body = req.body as createCommentInputs["body"];
			const { postId } = req.params as createCommentInputs["params"];
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			//find logged in user
			const user = await findUserById(userId);
			//check if user exist
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
			body.commentedBy = userId;
			body.post = postId;
			const comment = await createcomment(body);
			await post.comments?.push(comment._id);
			post.numOfComments = post.comments?.length;
			await post.save();
			res.status(StatusCodes.CREATED).json({
				success: true,
				message: "Comment successfully submitted!",
				data: comment,
			});
		} catch (error: any) {
			log.info(error.message);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: `Unable to comment on post: ${error.message}`,
			});
		}
	}
}
