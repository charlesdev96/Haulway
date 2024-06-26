import { Router } from "express";
import { InfluencerProductController } from "../controller/influencerProductController";
import { profiles } from "../controller/profileController";
import { UserController } from "../controller/userController";
import { authorizeUser, validateInputs } from "../middleware";
import {
	influencerProductSchema,
	updateInfluencerProductSchema,
} from "../schema";

export class InfluencerRouter {
	private router: Router;
	private influencerProductCon: InfluencerProductController;
	private profile: profiles;
	private userController: UserController;
	constructor() {
		this.router = Router();
		this.influencerProductCon = new InfluencerProductController();
		this.profile = new profiles();
		this.userController = new UserController();
		this.initializeRoute();
	}
	private initializeRoute() {
		//create influencer product
		this.router.post(
			"/create-product",
			authorizeUser,
			validateInputs(influencerProductSchema),
			this.influencerProductCon.createProduct.bind(this.influencerProductCon),
		);
		//get influencer profile
		this.router.get(
			"/influencer-profile",
			authorizeUser,
			this.profile.influencerProfile.bind(this.profile),
		);
		//get influencer store
		this.router.get(
			"/influencer-store",
			authorizeUser,
			this.profile.influencerStore.bind(this.profile),
		);
		//get all influencers for contracts
		this.router.get(
			"/get-all-influencers",
			authorizeUser,
			this.userController.getAllInfluencersForContracts.bind(
				this.userController,
			),
		);
		//update influencer product
		this.router.patch(
			"/update-product/:productId",
			authorizeUser,
			validateInputs(updateInfluencerProductSchema),
			this.influencerProductCon.updateProduct.bind(this.influencerProductCon),
		);
	}

	public getInfluencerRoute() {
		return this.router;
	}
}
