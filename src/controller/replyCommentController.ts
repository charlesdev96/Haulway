import { Response } from "express";
import {
	createreplyInputs,
	editReplyInputs,
	deleteReplyInputs,
} from "../schema";
import {
	findCommentById,
	CustomRequest,
	findUserById,
	createreply,
	findReplyById,
} from "../services";
import { log } from "../utils";
import { StatusCodes } from "http-status-codes";

export class ReplyCommentController {
	public async CreateReply(req: CustomRequest, res: Response) {
		try {
			const body = req.body as createreplyInputs["body"];
			const { commentId, postId } = req.params as createreplyInputs["params"];
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
			//check if comment exist
			const comment = await findCommentById(commentId);
			if (!comment) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "comment not found" });
			}
			//proceed to reply a comment
			body.comment = commentId;
			body.replier = userId;
			body.post = postId;
			const reply = await createreply(body);
			await comment.replies?.push(reply._id);
			comment.numOfReplies = comment.replies?.length;
			await comment.save();
			res.status(StatusCodes.CREATED).json({
				success: true,
				message: "Successfully replied the comment",
				data: reply,
			});
		} catch (error: any) {
			log.info(error.message);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: `Unable to reply comment: ${error.message}`,
			});
		}
	}

	public async editReply(req: CustomRequest, res: Response) {
		try {
			const { reply } = req.body as editReplyInputs["body"];
			const { replyId } = req.params as editReplyInputs["params"];
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
			const replys = await findReplyById(replyId);
			//check if user exist
			if (!replys) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "reply not found" });
			}
			//check if reply belong to user
			if (replys.replier?.toString() !== userId.toString()) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					message:
						"Oops! It looks like you can't edit this reply. Only the owner can make changes.",
				});
			}
			//update the reply
			replys.reply = reply;
			//save updated reply
			await replys.save();
			res.status(StatusCodes.OK).json({
				success: true,
				message: "Congratulations!!!, reply has been successfully updated",
			});
		} catch (error: any) {
			log.info(error.message);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: `Unable to edit reply comment: ${error.message}`,
			});
		}
	}

	public async deleteReply(req: CustomRequest, res: Response) {
		try {
			const { replyId } = req.params as deleteReplyInputs;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			//find logged in user
			const user = await findUserById(userId);
			//find reply
			const reply = await findReplyById(replyId);
			//check if user exist
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			if (!reply) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Reply not found" });
			}
			//check if reply belong to user
			if (userId.toString() !== reply.replier?.toString()) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					message:
						"Oops! It looks like you can't delete this reply. Only the owner can delete reply.",
				});
			}
			const commentId = reply.comment?.toString();
			if (!commentId) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Comment not found" });
			}
			const comment = await findCommentById(commentId);
			if (!comment) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "comment not found" });
			}
			//reduce the number of comments and remove reply from comment
			comment.replies = comment.replies?.filter(
				(reply) => reply.toString() !== replyId.toString(),
			);
			comment.numOfReplies = comment.replies?.length;
			await comment.save();
			//proceed to delete reply
			await reply.deleteOne();
			res
				.status(StatusCodes.OK)
				.json({ success: true, message: "Reply successfully deleted" });
		} catch (error: any) {
			log.info(error.message);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: `Unable to edit reply comment: ${error.message}`,
			});
		}
	}
}
