/* eslint @typescript-eslint/no-explicit-any: "off" */

import { Response } from "express";
import { createreplyInputs } from "../schema";
import {
	findCommentById,
	CustomRequest,
	findUserById,
	createreply,
} from "../services";
import { log } from "../utils";
import { StatusCodes } from "http-status-codes";

export class ReplyCommentController {
	public async CreateReply(req: CustomRequest, res: Response) {
		try {
			const body = req.body as createreplyInputs["body"];
			const { commentId } = req.params as createreplyInputs["params"];
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
}
