import { Router } from "express";
import { CommentController } from "../controller/commentController";
import {
	createCommentSchema,
	updateCommentSchema,
	deletecommentSchema,
} from "../schema";
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
		//update comment
		this.router.patch(
			"/edit-comment/:commentId",
			authorizeUser,
			validateInputs(updateCommentSchema),
			this.commentController.editComment.bind(this.commentController),
		);
		//delete comment
		this.router.delete(
			"/delete-comment/:commentId",
			authorizeUser,
			validateInputs(deletecommentSchema),
			this.commentController.deleteComment.bind(this.commentController),
		);
	}

	public getCommentRouter() {
		return this.router;
	}
}
