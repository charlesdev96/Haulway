import { Router } from "express";
import { VendorProductController } from "../controller/vendorProductController";
import { validateInputs, authorizeUser } from "../middleware";
import { vendorProductSchema, updateVendorProductSchema } from "../schema";

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
		//get all products
		this.router.get(
			"/get-vendor-products",
			authorizeUser,
			this.vendorProductController.getAllVendorProducts.bind(
				this.vendorProductController,
			),
		);
		//buy product
		this.router.post(
			"/buy-product/:productId",
			authorizeUser,
			this.vendorProductController.buyProduct.bind(
				this.vendorProductController,
			),
		);
		//update product
		this.router.patch(
			"/update-product/:productId",
			authorizeUser,
			validateInputs(updateVendorProductSchema),
			this.vendorProductController.updateProduct.bind(
				this.vendorProductController,
			),
		);
	}

	public getVendorRouter() {
		return this.router;
	}
}
