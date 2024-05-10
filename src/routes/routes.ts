import { Router } from "express";
import { authRoute } from "./authRoute";
import { profileRoute } from "./profileRoutes";
import { FilesUploadRouter } from "./filesRoutes";

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
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default RouterConfig;
