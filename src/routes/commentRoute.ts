import { Router } from "express";
import { CommentController } from "../controller/commentController";
import { createCommentSchema } from "../schema";
import { authorizeUser, validateInputs } from "../middleware";

export class commentRouter {
	private router: Router;
	private commentController: CommentController;
	constructor() {
		this.router = Router();
		this.commentController = new CommentController();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		//comment on a post
		this.router.post(
			"/create-comment/:postId",
			authorizeUser,
			validateInputs(createCommentSchema),
			this.commentController.createComment.bind(this.commentController),
		);
	}

	public getCommentRouter() {
		return this.router;
	}
}
