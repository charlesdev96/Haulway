import { Router } from "express";
import { ProductReviewController } from "../controller/reviewProductController";
import { validateInputs, authorizeUser } from "../middleware";
import { reviewProductSchema } from "../schema";

export class ReviewProductRouter {
	private router: Router;
	private productReviewController: ProductReviewController;
	constructor() {
		this.router = Router();
		this.productReviewController = new ProductReviewController();
		this.initializeRouter();
	}

	private initializeRouter() {
		this.router.post(
			"/review-product/:productId",
			authorizeUser,
			validateInputs(reviewProductSchema),
			this.productReviewController.productReview.bind(
				this.productReviewController,
			),
		);
	}

	public getReviewProductRouter() {
		return this.router;
	}
}
