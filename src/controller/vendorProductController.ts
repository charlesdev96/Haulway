import { Response } from "express";
import { vendorProductInputs, updateVendorProductInputs } from "../schema";
import {
	CustomRequest,
	findUserById,
	createNewVendorProduct,
	findStoreByUserId,
	updateVendorProduct,
	findVendorProductById,
	getVendorProductsByUserId,
} from "../services";
import { log, paymentInitializationFunction } from "../utils";
import { StatusCodes } from "http-status-codes";

export class VendorProductController {
	public async createProduct(req: CustomRequest, res: Response) {
		try {
			const body = req.body as vendorProductInputs;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			//find logged in user
			const user = await findUserById(userId);
			//check if user exist
			if (!user || !user.role) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			//check user role
			if (user.role !== "vendor") {
				return res.status(StatusCodes.FORBIDDEN).json({
					message:
						"You are forbidden to access this route. Only vendors are allowed.",
				});
			}
			//find user store
			const store = await findStoreByUserId(userId.toString());
			if (!store) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "No store found for the user" });
			}
			//proceed to create product
			body.vendor = userId;
			body.store = store._id;
			const discountedPrice: number =
				(1 - (body.productPrice.discount || 0)) * body.productPrice.basePrice;
			body.productPrice.discountPrice = Number(discountedPrice.toFixed(2));
			body.productPrice.price = body.productPrice.discountPrice;
			const product = await createNewVendorProduct(body);
			if (!product || !product._id) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Unable to create product" });
			}
			//update user that created the product
			user.products?.push(product._id);
			user.numOfProducts = user.products?.length;
			await user.save();
			//find user store and push product to it
			store.products?.push(product._id);
			store.numOfProducts = store.products?.length;
			await store.save();
			res.status(StatusCodes.CREATED).json({
				success: true,
				message: "Congratulations, you have successfully created a product",
				data: product,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to create product due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while creating the product",
				});
			}
		}
	}

	public async updateProduct(req: CustomRequest, res: Response) {
		try {
			const body = req.body as updateVendorProductInputs["body"];
			const { productId } = req.params as updateVendorProductInputs["params"];
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			//find logged in user
			const user = await findUserById(userId);
			//check if user exist
			if (!user || !user.role) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			//check user role
			if (user.role !== "vendor") {
				return res.status(StatusCodes.FORBIDDEN).json({
					message:
						"You are forbidden to access this route. Only vendors are allowed.",
				});
			}
			//find product
			const product = await findVendorProductById(productId);
			if (!product) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Product not found" });
			}
			//check if product belong to user
			if (product.vendor?.toString() !== userId.toString()) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					message:
						"Oops! It looks like you can't edit this product. Only the author can make changes.",
				});
			}
			// proceed to update product
			if (body.productPrice && body.productPrice.basePrice) {
				const discountedPrice: number =
					(1 - (body.productPrice.discount || 0)) * body.productPrice.basePrice;
				body.productPrice.discountPrice = Number(discountedPrice.toFixed(2));
				body.productPrice.price = body.productPrice.discountPrice;
				await updateVendorProduct(productId, body);
				res.status(StatusCodes.OK).json({
					success: true,
					message: "Product successfully updated",
				});
			} else {
				await updateVendorProduct(productId, body);
				res.status(StatusCodes.OK).json({
					success: true,
					message: "Product successfully updated",
				});
			}
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
					return res
						.status(StatusCodes.INTERNAL_SERVER_ERROR)
						.json({ message: "Wrong Id format" });
				}
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to create product due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while creating the product",
				});
			}
		}
	}

	public async getAllVendorProducts(req: CustomRequest, res: Response) {
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
			if (!user || !user.role) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			//check user role
			if (user.role !== "vendor") {
				return res.status(StatusCodes.FORBIDDEN).json({
					message:
						"You are forbidden to access this route. Only vendors are allowed.",
				});
			}
			const products = await getVendorProductsByUserId(userId);
			res.status(StatusCodes.OK).json({
				success: true,
				message: "List of all products",
				data: products,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to create vendor post due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while creating vendor post",
				});
			}
		}
	}

	public async buyProduct(req: CustomRequest, res: Response) {
		try {
			const { productId } = req.params;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			//find logged in user
			const user = await findUserById(userId);
			//check if user exist
			if (!user || !user.role) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}

			//find product
			const product = await findVendorProductById(productId);
			if (!product || !product.productPrice?.price || !product.genInfo?.name) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Product not found" });
			}

			const paymentUrl = await paymentInitializationFunction(
				product.productPrice?.price,
				1,
				product.genInfo?.name,
			);
			res.status(StatusCodes.OK).json({
				success: true,
				message: "Please use the link for your payment",
				data: paymentUrl,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
					return res
						.status(StatusCodes.INTERNAL_SERVER_ERROR)
						.json({ message: "Wrong Id format" });
				}
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to create product payment link due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message:
						"An unknown error occurred while creating the product payment link",
				});
			}
		}
	}
}
