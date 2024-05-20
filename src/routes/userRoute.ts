import { Router } from "express";
import { authorizeUser } from "../middleware";
import { UserController } from "../controller/userController";

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
	}

	public getAllUserRouter() {
		return this.router;
	}
}
