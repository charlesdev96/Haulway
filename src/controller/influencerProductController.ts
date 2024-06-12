import { Response } from "express";
import {
	influencerProductInputs,
	updateInfluencerProductInputs,
} from "../schema";
import {
	CustomRequest,
	findUserById,
	createNewInfluencerProduct,
	findStoreByUserId,
	findInfluencerProductById,
	updateInfluencerProduct,
} from "../services";
import { log } from "../utils";
import { StatusCodes } from "http-status-codes";

export class InfluencerProductController {
	public async createProduct(req: CustomRequest, res: Response) {
		try {
			const body = req.body as influencerProductInputs;
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
			if (user.role !== "influencer") {
				return res.status(StatusCodes.FORBIDDEN).json({
					message:
						"You are forbidden to access this route. Only influencers are allowed.",
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
			body.influencer = userId;
			body.store = store._id;
			const discountedPrice: number =
				(1 - (body.productPrice.discount || 0)) * body.productPrice.basePrice;
			body.productPrice.discountPrice = Number(discountedPrice.toFixed(2));
			body.productPrice.price = body.productPrice.discountPrice;
			const product = await createNewInfluencerProduct(body);
			if (!product || !product._id) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Unable to create product" });
			}
			//update user that created the product
			user.influencerPro?.push(product._id);
			user.numOfProducts = user.influencerPro?.length;
			await user.save();
			//find user store and push product to it
			store.influencerProducts?.push(product._id);
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
			const body = req.body as updateInfluencerProductInputs["body"];
			const { productId } =
				req.params as updateInfluencerProductInputs["params"];
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
			if (user.role !== "influencer") {
				return res.status(StatusCodes.FORBIDDEN).json({
					message:
						"You are forbidden to access this route. Only vendors are allowed.",
				});
			}
			//find product
			const product = await findInfluencerProductById(productId);
			if (!product) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Product not found" });
			}
			//check if product belong to user
			if (product.influencer?.toString() !== userId.toString()) {
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
				await updateInfluencerProduct(productId, body);
				res.status(StatusCodes.OK).json({
					success: true,
					message: "Product successfully updated",
				});
			} else {
				await updateInfluencerProduct(productId, body);
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
}
