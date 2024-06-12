import { Router } from "express";
import { StripeController } from "../controller/stripeController";
import { authorizeUser, validateInputs } from "../middleware";
import { onboardUserSchema } from "../schema";

export class StripeRouter {
	private router: Router;
	private stripeController: StripeController;
	constructor() {
		this.router = Router();
		this.stripeController = new StripeController();
		this.initializeRoute();
	}

	private initializeRoute() {
		this.router.post(
			"/stripe-onboarding",
			authorizeUser,
			validateInputs(onboardUserSchema),
			this.stripeController.stripeOnBoarding.bind(this.stripeController),
		);

		this.router.get(
			"/check-status/:stripeId",
			this.stripeController.checkOnboardingStatus.bind(this.stripeController),
		);

		//delete stripe account
		this.router.delete(
			"/delete-account/:stripeId",
			this.stripeController.deleteStripeAccount.bind(this.stripeController),
		);
	}

	public getAllStripeRoute() {
		return this.router;
	}
}
