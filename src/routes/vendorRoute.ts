import { Router } from "express";
import { VendorProductController } from "../controller/vendorProductController";
import { profiles } from "../controller/profileController";
import { validateInputs, authorizeUser } from "../middleware";
import {
	vendorProductSchema,
	updateVendorProductSchema,
	deleteVendorProductSchema,
} from "../schema";

export class VendorRouter {
	private router: Router;
	private vendorProductController: VendorProductController;
	private profile: profiles;
	constructor() {
		this.router = Router();
		this.vendorProductController = new VendorProductController();
		this.profile = new profiles();
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
		//vendor store
		this.router.get(
			"/vendor-store",
			authorizeUser,
			this.profile.vendorStore.bind(this.profile),
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
		//delete product
		this.router.delete(
			"/delete-product/:productId",
			authorizeUser,
			validateInputs(deleteVendorProductSchema),
			this.vendorProductController.deleteProduct.bind(
				this.vendorProductController,
			),
		);
	}

	public getVendorRouter() {
		return this.router;
	}
}
