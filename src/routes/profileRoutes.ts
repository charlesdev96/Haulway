import { Router } from "express";
import { authorizeUser } from "../middleware";
import { profiles } from "../controller/profileController";

export class profileRoute {
	private router: Router;
	private profileController: profiles;
	constructor() {
		this.router = Router();
		this.profileController = new profiles();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		//user profile
		this.router.get(
			"/profile",
			authorizeUser,
			this.profileController.userProfile.bind(this.profileController),
		);
	}
	public getProfileRoutes() {
		return this.router;
	}
}
