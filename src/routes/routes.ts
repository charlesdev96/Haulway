import { Router } from "express";
import { authRoute } from "./authRoute";
import { profileRoute } from "./profileRoutes";

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
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default RouterConfig;
