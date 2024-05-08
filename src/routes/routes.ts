import { Router } from "express";
import { authRoute } from "./authRoute";

class RouterConfig {
	private router: Router;
	constructor() {
		this.router = Router();
		this.configureRoutes();
	}

	private configureRoutes() {
		const baseUrl: string = "/api/v1";

		this.router.use(`${baseUrl}/auth`, new authRoute().getAuthRouter());
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default RouterConfig;
