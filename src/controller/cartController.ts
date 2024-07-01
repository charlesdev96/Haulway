import { Response } from "express";
import {
	findUserById,
	addItemToCart,
	createCartFirstTime,
	checkIfProductInUserCart,
	checkIfUserCartExist,
	CustomRequest,
	findVendorProductById,
	getUserCartItems,
	findPostById,
} from "../services";
import {
	addItemToCartInputs,
	updateCartInputs,
	removeItemInputs,
} from "../schema";
import { StatusCodes } from "http-status-codes";
import { log } from "../utils";

export class CartController {
	public async addProductToCart(req: CustomRequest, res: Response) {
		try {
			const body = req.body as addItemToCartInputs["body"];
			const { productId, postId } = req.params as addItemToCartInputs["params"];
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			//find logged in user
			const user = await findUserById(userId);
			//check if user exist
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			//find post
			const post = await findPostById(postId);
			if (!post || !post.postedBy) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Post not found" });
			}
			//find owner of post
			const poster = await findUserById(post.postedBy);
			if (!poster || !poster.role) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Post owner not found" });
			}
			//find product
			const product = await findVendorProductById(productId);
			if (!product) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}

			//check if user already has a cart model already
			const userCartExist = await checkIfUserCartExist(userId);
			//if user has cart, then check if product is already in cart and if not add it
			if (userCartExist) {
				//check if product is already in cart
				const productAlreadyInCart = await checkIfProductInUserCart(
					productId,
					userCartExist._id,
				);
				if (productAlreadyInCart) {
					return res
						.status(StatusCodes.BAD_REQUEST)
						.json({ message: "Product already in your cart" });
				} else {
					//else add product to cart
					if (poster.role === "influencer") {
						body.cart = userCartExist._id;
						body.product = product._id;
						body.store = product.store;
						body.influencer = poster._id;
						body.post = postId;
						const item = await addItemToCart(body);
						if (item && item._id) {
							userCartExist.cartItems?.push(item._id);
							await userCartExist.save();
						}
						return res.status(StatusCodes.OK).json({
							success: true,
							message: "Item successfully added to cart",
							data: item,
						});
					} else {
						body.cart = userCartExist._id;
						body.product = product._id;
						body.store = product.store;
						body.influencer = null;
						body.post = postId;
						const item = await addItemToCart(body);
						if (item && item._id) {
							userCartExist.cartItems?.push(item._id);
							await userCartExist.save();
						}
						return res.status(StatusCodes.OK).json({
							success: true,
							message: "Item successfully added to cart",
							data: item,
						});
					}
				}
			} else {
				//create cart model and add item to cart
				const cart = await createCartFirstTime({ user: userId });
				if (poster.role === "influencer") {
					//add item to cart
					body.cart = cart._id;
					body.product = product._id;
					body.store = product.store;
					body.post = postId;
					body.influencer = poster._id;
					const item = await addItemToCart(body);
					if (item && item._id) {
						cart.cartItems?.push(item._id);
						await cart.save();
					}
					user.carts = cart._id;
					await user.save();
					return res.status(StatusCodes.OK).json({
						success: true,
						message: "Item successfully added to cart",
						data: item,
					});
				} else {
					//add item to cart
					body.cart = cart._id;
					body.product = product._id;
					body.store = product.store;
					body.post = postId;
					body.influencer = null;
					const item = await addItemToCart(body);
					if (item && item._id) {
						cart.cartItems?.push(item._id);
						await cart.save();
					}
					user.carts = cart._id;
					await user.save();
					return res.status(StatusCodes.OK).json({
						success: true,
						message: "Item successfully added to cart",
						data: item,
					});
				}
			}
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to add product to cart due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while adding product to cart",
				});
			}
		}
	}

	public async updateCartItems(req: CustomRequest, res: Response) {
		try {
			const { productId } = req.params as updateCartInputs["params"];
			const { quantity } = req.body as updateCartInputs["body"];
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			//find logged in user
			const user = await findUserById(userId);
			//check if user exist
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			//find user's cart
			const cart = await checkIfUserCartExist(userId);
			if (!cart) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User cart not found" });
			}
			//find the cart item to be updated
			const cartItem = await checkIfProductInUserCart(productId, cart._id);
			if (!cartItem) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "cart item not found" });
			}
			//proceed to update cart item
			if (quantity) cartItem.quantity = quantity;
			await cartItem.save();
			res
				.status(StatusCodes.OK)
				.json({ success: true, message: "Cart item successfullly updated" });
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to update cart due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while updating to cart",
				});
			}
		}
	}

	public async removeCartItem(req: CustomRequest, res: Response) {
		try {
			const { productId } = req.params as removeItemInputs;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			//find logged in user
			const user = await findUserById(userId);
			//check if user exist
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			//find user's cart
			const cart = await checkIfUserCartExist(userId);
			if (!cart) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User cart not found" });
			}
			//find the cart item to be updated
			const cartItem = await checkIfProductInUserCart(productId, cart._id);
			if (!cartItem) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "cart item not found" });
			}
			//proceed to remove item from users cart
			cart.cartItems = cart.cartItems?.filter(
				(item) => item.toString() !== cartItem._id.toString(),
			);
			await cart.save();
			//delete cart item from db
			await cartItem.deleteOne();
			res
				.status(StatusCodes.OK)
				.json({ success: true, message: "Cart item successfully removed" });
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to remove item from cart due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while removing item from cart",
				});
			}
		}
	}

	public async getUserCart(req: CustomRequest, res: Response) {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			//find logged in user
			const user = await findUserById(userId);
			//check if user exist
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			const cart = await getUserCartItems(userId);
			if (!cart) {
				return res.status(StatusCodes.OK).json({
					success: true,
					message: "Your cart is currently empty.",
					data: [],
				});
			}
			res.status(StatusCodes.OK).json({
				success: true,
				message: "Your cart has been successfully retrieved.",
				data: cart,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to get user cart: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while getting user cart",
				});
			}
		}
	}
}
