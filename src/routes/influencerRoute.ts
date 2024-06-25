import { Router } from "express";
import { InfluencerProductController } from "../controller/influencerProductController";
import { profiles } from "../controller/profileController";
import { authorizeUser, validateInputs } from "../middleware";
import {
	influencerProductSchema,
	updateInfluencerProductSchema,
} from "../schema";

export class InfluencerRouter {
	private router: Router;
	private influencerProductCon: InfluencerProductController;
	private profile: profiles;
	constructor() {
		this.router = Router();
		this.influencerProductCon = new InfluencerProductController();
		this.profile = new profiles();
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
