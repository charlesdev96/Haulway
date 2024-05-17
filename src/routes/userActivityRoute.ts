import { Router } from "express";
import { UserActivitiesController } from "../controller/userActivityController";
import { authorizeUser, validateInputs } from "../middleware";
import { followerUserSchema, likePostSchema } from "../schema";

export class UserActivityRouter {
	private router: Router;
	private userActivityController: UserActivitiesController;
	constructor() {
		this.router = Router();
		this.userActivityController = new UserActivitiesController();
		this.initializeRoutes();
	}
	private initializeRoutes() {
		//follow and unfollower user
		this.router.patch(
			"/follow-user/:targetUserId",
			authorizeUser,
			validateInputs(followerUserSchema),
			this.userActivityController.followUser.bind(this.userActivityController),
		);
		//like and unlike a post
		this.router.patch(
			"/like-post/:postId",
			authorizeUser,
			validateInputs(likePostSchema),
			this.userActivityController.likePost.bind(this.userActivityController),
		);
	}

	public getUserActivityRouter() {
		return this.router;
	}
}
