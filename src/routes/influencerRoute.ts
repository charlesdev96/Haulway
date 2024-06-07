import { Router } from "express";
import { InfluencerProductController } from "../controller/influencerProductController";
import { authorizeUser, validateInputs } from "../middleware";
import { influencerProductSchema } from "../schema";

export class InfluencerRouter {
	private router: Router;
	private influencerProductCon: InfluencerProductController;
	constructor() {
		this.router = Router();
		this.influencerProductCon = new InfluencerProductController();
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
	}

	public getInfluencerRoute() {
		return this.router;
	}
}
