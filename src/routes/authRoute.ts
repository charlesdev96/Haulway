import { Router } from "express";
import { authController } from "../controller/authController";
import { registerUserSchema } from "../schema";
import { validateInputs } from "../middleware";

export class authRoute {
	private router: Router;
	private userAuthentication: authController;
	constructor() {
		this.router = Router();
		this.userAuthentication = new authController();
		this.initializeRoutes();
	}
	private initializeRoutes() {
		//register user
		this.router.post(
			"/register",
			validateInputs(registerUserSchema),
			this.userAuthentication.register.bind(this.userAuthentication),
		);
	}

	public getAuthRouter() {
		return this.router;
	}
}
