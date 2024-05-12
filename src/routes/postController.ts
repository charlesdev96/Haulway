import { Router } from "express";
import { PostController } from "../controller/postController";
import { authorizeUser, validateInputs } from "../middleware";
import { createPostSchema, updatePostSchema } from "../schema";

export class PostRouter {
	private router: Router;
	private postController: PostController;
	constructor() {
		this.router = Router();
		this.postController = new PostController();
		this.initializeRoutes();
	}
	private initializeRoutes() {
		//create post
		this.router.post(
			"/create-post",
			authorizeUser,
			validateInputs(createPostSchema),
			this.postController.createPost.bind(this.postController),
		);
		//update post
		this.router.patch(
			"/update-post/:postId",
			authorizeUser,
			validateInputs(updatePostSchema),
			this.postController.updatePost.bind(this.postController),
		);
	}

	public getPostRouter() {
		return this.router;
	}
}
