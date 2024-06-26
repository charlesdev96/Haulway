import { Router } from "express";
import { VendorProductController } from "../controller/vendorProductController";
import { profiles } from "../controller/profileController";
import { validateInputs, authorizeUser } from "../middleware";
import {
	vendorProductSchema,
	updateVendorProductSchema,
	deleteVendorProductSchema,
	getVendorProductSchema,
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
		//get vendors with products
		this.router.get(
			"/vendors-with-products",
			authorizeUser,
			this.vendorProductController.getAllVendorsWithProducts.bind(
				this.vendorProductController,
			),
		);
		//get logged in vendor products
		this.router.get(
			"/my-products",
			authorizeUser,
			this.vendorProductController.loggedInVendorProducts.bind(
				this.vendorProductController,
			),
		);
		//get vendor product
		this.router.get(
			"/vendor-product/:vendorId",
			authorizeUser,
			validateInputs(getVendorProductSchema),
			this.vendorProductController.getSingleVendorProduct.bind(
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
