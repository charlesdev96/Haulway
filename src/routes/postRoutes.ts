import { Router } from "express";
import { PostController } from "../controller/postController";
import { authorizeUser, validateInputs } from "../middleware";
import {
	createUserPostSchema,
	updatePostSchema,
	deletePostSchema,
	getSinglePostSchema,
	createVendorPostSchema,
	savePostSchema,
	getPostByOptionSchema,
} from "../schema";

export class PostRouter {
	private router: Router;
	private postController: PostController;
	constructor() {
		this.router = Router();
		this.postController = new PostController();
		this.initializeRoutes();
	}
	private initializeRoutes() {
		//get all posts
		this.router.get(
			"/display-posts",
			authorizeUser,
			this.postController.getAllPost.bind(this.postController),
		);
		//display trending post
		this.router.get(
			"/trending-posts",
			authorizeUser,
			this.postController.getAllTrendingPost.bind(this.postController),
		);
		//get post by option
		this.router.get(
			"/post-option",
			authorizeUser,
			validateInputs(getPostByOptionSchema),
			this.postController.postByOption.bind(this.postController),
		);
		//create post
		this.router.post(
			"/create-user-post",
			authorizeUser,
			validateInputs(createUserPostSchema),
			this.postController.createUserPost.bind(this.postController),
		);
		//create vendor influencer
		this.router.post(
			"/create-vendor-influencer-post",
			authorizeUser,
			validateInputs(createVendorPostSchema),
			this.postController.createVendorPost.bind(this.postController),
		);
		//get products for post
		this.router.get(
			"/get-post-product",
			authorizeUser,
			this.postController.getUserProductsForPost.bind(this.postController),
		);
		//save post
		this.router.post(
			"/save-post/:postId",
			authorizeUser,
			validateInputs(savePostSchema),
			this.postController.savePost.bind(this.postController),
		);
		//get single post
		this.router.get(
			"/get-post/:postId",
			authorizeUser,
			validateInputs(getSinglePostSchema),
			this.postController.getSinglePost.bind(this.postController),
		);
		//update post
		this.router.patch(
			"/update-post/:postId",
			authorizeUser,
			validateInputs(updatePostSchema),
			this.postController.updatePost.bind(this.postController),
		);
		//delete post
		this.router.delete(
			"/delete-post/:postId",
			authorizeUser,
			validateInputs(deletePostSchema),
			this.postController.deletePost.bind(this.postController),
		);
	}

	public getPostRouter() {
		return this.router;
	}
}
