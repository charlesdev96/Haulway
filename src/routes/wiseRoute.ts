import { Router } from "express";
import { WiseController } from "../controller/wiseController";
import { validateInputs, authorizeUser } from "../middleware";
import { createProfileSchema } from "../schema";

export class WiseRouter {
	private router: Router;
	private wiseController: WiseController;
	constructor() {
		this.router = Router();
		this.wiseController = new WiseController();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		//create a wise profile
		this.router.post(
			"/create-profile",
			authorizeUser,
			validateInputs(createProfileSchema),
			this.wiseController.createUserProfile.bind(this.wiseController),
		);
	}

	public getWiseRouter() {
		return this.router;
	}
}
