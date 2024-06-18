import { Router } from "express";
import { authorizeUser, validateInputs } from "../middleware";
import { UserController } from "../controller/userController";
import { getSingleUserSchema, searchUserSchema } from "../schema";

export class UserRouter {
	private router: Router;
	private userController: UserController;
	constructor() {
		this.router = Router();
		this.userController = new UserController();
		this.initializeRoutes();
	}
	private initializeRoutes() {
		//get all users
		this.router.get(
			"/get-all-users",
			authorizeUser,
			this.userController.getAllUsers.bind(this.userController),
		);
		//get all vendors
		this.router.get(
			"/get-all-vendors",
			authorizeUser,
			this.userController.getAllVendors.bind(this.userController),
		);
		//get all influencers
		this.router.get(
			"/get-all-influencers",
			authorizeUser,
			this.userController.getAllInfluencers.bind(this.userController),
		);
		//search for users
		this.router.get(
			"/search-users",
			authorizeUser,
			validateInputs(searchUserSchema),
			this.userController.searchUsers.bind(this.userController),
		);
		//search for vendors
		this.router.get(
			"/search-vendor",
			authorizeUser,
			validateInputs(searchUserSchema),
			this.userController.searchForVendors.bind(this.userController),
		);
		//search for influencers
		this.router.get(
			"/search-influencer",
			authorizeUser,
			validateInputs(searchUserSchema),
			this.userController.searchForInfluencers.bind(this.userController),
		);
		//get single user route
		this.router.get(
			"/get-single-user/:id",
			authorizeUser,
			validateInputs(getSingleUserSchema),
			this.userController.getSingleUser.bind(this.userController),
		);
	}

	public getAllUserRouter() {
		return this.router;
	}
}
