import { Router } from "express";
import { authorizeUser, validateInputs } from "../middleware";
import { profiles } from "../controller/profileController";
import { updateProfileSchema } from "../schema";

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
			"/user-profile",
			authorizeUser,
			this.profileController.userProfile.bind(this.profileController),
		);
		//update profile
		this.router.patch(
			"/update-profile",
			authorizeUser,
			validateInputs(updateProfileSchema),
			this.profileController.updateProfile.bind(this.profileController),
		);
	}
	public getProfileRoutes() {
		return this.router;
	}
}
