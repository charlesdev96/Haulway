import { Response } from "express";
import {
	createCommentInputs,
	updateCommentInputs,
	deletecommentInputs,
} from "../schema";
import {
	CustomRequest,
	findUserById,
	findPostById,
	createcomment,
	findCommentById,
	deleteRepliesByCommentId,
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

	public async editComment(req: CustomRequest, res: Response) {
		try {
			const { commentId } = req.params as updateCommentInputs["params"];
			const { comment } = req.body as updateCommentInputs["body"];
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
			//find comment to be updated
			const comments = await findCommentById(commentId);
			//check if comment exist
			if (!comments) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Comment not found" });
			}
			//check if comment belong to user
			if (userId.toString() !== comments.commentedBy?.toString()) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					success: false,
					message: "You can only edit your own comment.",
				});
			}
			//proceed to update comment
			comments.comment = comment;
			await comments.save();
			res
				.status(StatusCodes.OK)
				.json({ success: true, message: "Your comment has been updated." });
		} catch (error: any) {
			log.info(error.message);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: `Unable to edit comment: ${error.message}`,
			});
		}
	}

	public async deleteComment(req: CustomRequest, res: Response) {
		try {
			const { commentId } = req.params as deletecommentInputs;
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
			//find comment to be updated
			const comments = await findCommentById(commentId);
			//check if comment exist
			if (!comments) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Comment not found" });
			}
			//check if comment belong to user
			if (userId.toString() !== comments.commentedBy?.toString()) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					success: false,
					message: "You can only edit your own comment.",
				});
			}
			//reduce the comment on the post
			const postId = comments.post;
			if (!postId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "No postId found" });
			}
			const post = await findPostById(postId);
			if (!post) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Post not found" });
			}
			//remove comment from post and reduce the numOfComments
			post.comments = post.comments?.filter(
				(comment) => comment.toString() !== commentId.toString(),
			);
			post.numOfComments = post.comments?.length;
			await post.save();
			//delete replies
			await deleteRepliesByCommentId(commentId);
			//then delete comment
			await comments.deleteOne();
			res
				.status(StatusCodes.OK)
				.json({ success: true, message: "Your comment has been deleted." });
		} catch (error: any) {
			log.info(error.message);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: `Unable to delete comment: ${error.message}`,
			});
		}
	}
}
