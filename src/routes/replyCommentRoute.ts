import { Router } from "express";
import { ReplyCommentController } from "../controller/replyCommentController";
import { authorizeUser, validateInputs } from "../middleware";
import { createreplySchema } from "../schema";

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
			"/create-reply/:commentId",
			authorizeUser,
			validateInputs(createreplySchema),
			this.replyCommentController.CreateReply.bind(this.replyCommentController),
		);
	}

	public getReplyCommentRouter() {
		return this.router;
	}
}
