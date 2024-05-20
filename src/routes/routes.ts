import { Router } from "express";
import { authRoute } from "./authRoute";
import { profileRoute } from "./profileRoutes";
import { FilesUploadRouter } from "./filesRoutes";
import { PostRouter } from "./postRoutes";
import { commentRouter } from "./commentRoute";
import { ReplyCommentRouter } from "./replyCommentRoute";
import { UserActivityRouter } from "./userActivityRoute";
import { UserRouter } from "./userRoute";

class RouterConfig {
	private router: Router;
	constructor() {
		this.router = Router();
		this.configureRoutes();
	}

	private configureRoutes() {
		const baseUrl: string = "/api/v1";
		//authentication route
		this.router.use(`${baseUrl}/auth`, new authRoute().getAuthRouter());

		//profile routes
		this.router.use(
			`${baseUrl}/profile`,
			new profileRoute().getProfileRoutes(),
		);

		//files upload
		this.router.use(`${baseUrl}`, new FilesUploadRouter().getFiles());

		//post routes
		this.router.use(`${baseUrl}/post`, new PostRouter().getPostRouter());

		//comment route
		this.router.use(
			`${baseUrl}/comment`,
			new commentRouter().getCommentRouter(),
		);

		//reply comment route
		this.router.use(
			`${baseUrl}/reply`,
			new ReplyCommentRouter().getReplyCommentRouter(),
		);

		//user activities router
		this.router.use(
			`${baseUrl}/activity`,
			new UserActivityRouter().getUserActivityRouter(),
		);
		//user router
		this.router.use(`${baseUrl}/user`, new UserRouter().getAllUserRouter());
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default RouterConfig;
