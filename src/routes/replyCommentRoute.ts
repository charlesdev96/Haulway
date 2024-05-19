import { Router } from "express";
import { ReplyCommentController } from "../controller/replyCommentController";
import { authorizeUser, validateInputs } from "../middleware";
import {
	createreplySchema,
	editReplySchema,
	deleteReplySchema,
} from "../schema";

export class ReplyCommentRouter {
	private router: Router;
	private replyCommentController: ReplyCommentController;
	constructor() {
		this.router = Router();
		this.replyCommentController = new ReplyCommentController();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		//reply a comment
		this.router.post(
			"/create-reply/:postId/:commentId",
			authorizeUser,
			validateInputs(createreplySchema),
			this.replyCommentController.CreateReply.bind(this.replyCommentController),
		);
		//edit reply
		this.router.patch(
			"/edit-reply/:replyId",
			authorizeUser,
			validateInputs(editReplySchema),
			this.replyCommentController.editReply.bind(this.replyCommentController),
		);
		//reply a comment
		this.router.delete(
			"/delete-reply/:replyId",
			authorizeUser,
			validateInputs(deleteReplySchema),
			this.replyCommentController.deleteReply.bind(this.replyCommentController),
		);
	}

	public getReplyCommentRouter() {
		return this.router;
	}
}
