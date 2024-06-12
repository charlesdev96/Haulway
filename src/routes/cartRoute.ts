import { Router } from "express";
import { CartController } from "../controller/cartController";
import { authorizeUser, validateInputs } from "../middleware";
import {
	addItemToCartSchema,
	updateCartSchema,
	removeItemSchema,
} from "../schema";

export class CartRouter {
	private router: Router;
	private cartController: CartController;
	constructor() {
		this.router = Router();
		this.cartController = new CartController();
		this.initializeRoute();
	}

	private initializeRoute() {
		//add item to cart
		this.router.post(
			"/add-item/:productId",
			authorizeUser,
			validateInputs(addItemToCartSchema),
			this.cartController.addProductToCart.bind(this.cartController),
		);
		//update cart item
		this.router.patch(
			"/update-item/:productId",
			authorizeUser,
			validateInputs(updateCartSchema),
			this.cartController.updateCartItems.bind(this.cartController),
		);
		//remove cart item
		this.router.delete(
			"/remove-item/:productId",
			authorizeUser,
			validateInputs(removeItemSchema),
			this.cartController.removeCartItem.bind(this.cartController),
		);
	}

	public getCartRouter() {
		return this.router;
	}
}
