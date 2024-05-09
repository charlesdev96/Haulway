import { Router } from "express";
import { authController } from "../controller/authController";
import { registerUserSchema, verifyUserSchema } from "../schema";
import { validateInputs, authorizeUser } from "../middleware";

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
		//resend verification email
		this.router.post(
			"/resend-email",
			authorizeUser,
			this.userAuthentication.resendVerificationEmail.bind(
				this.userAuthentication,
			),
		);
		//verify user
		this.router.get(
			"/verify-user",
			validateInputs(verifyUserSchema),
			this.userAuthentication.verifyUserAccount.bind(this.userAuthentication),
		);
	}

	public getAuthRouter() {
		return this.router;
	}
}
