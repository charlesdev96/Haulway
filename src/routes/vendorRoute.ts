import { Router } from "express";
import { VendorProductController } from "../controller/vendorProductController";
import { validateInputs, authorizeUser } from "../middleware";
import { vendorProductSchema } from "../schema";

export class VendorRouter {
	private router: Router;
	private vendorProductController: VendorProductController;
	constructor() {
		this.router = Router();
		this.vendorProductController = new VendorProductController();
		this.initializeRoute();
	}

	private initializeRoute() {
		this.router.post(
			"/create-product",
			authorizeUser,
			validateInputs(vendorProductSchema),
			this.vendorProductController.createProduct.bind(
				this.vendorProductController,
			),
		);
	}

	public getVendorRouter() {
		return this.router;
	}
}
