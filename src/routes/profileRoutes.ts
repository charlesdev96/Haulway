import { Router } from "express";
import { authorizeUser, validateInputs } from "../middleware";
import { profiles } from "../controller/profileController";
import {
	updateProfileSchema,
	deleteAccountSchema,
	upgradeAccountSchema,
	updateStoreSchema,
} from "../schema";

export class profileRoute {
	private router: Router;
	private profileController: profiles;
	constructor() {
		this.router = Router();
		this.profileController = new profiles();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		//upgrade account
		this.router.post(
			"/upgrade-account",
			authorizeUser,
			validateInputs(upgradeAccountSchema),
			this.profileController.upgradeAccount.bind(this.profileController),
		);
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
		//update store
		this.router.patch(
			"/update-store",
			authorizeUser,
			validateInputs(updateStoreSchema),
			this.profileController.updateStore.bind(this.profileController),
		);
		//delete account
		this.router.delete(
			"/delete-account",
			validateInputs(deleteAccountSchema),
			this.profileController.deleteAccount.bind(this.profileController),
		);
	}
	public getProfileRoutes() {
		return this.router;
	}
}
