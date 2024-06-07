import { Response } from "express";
import { vendorProductInputs } from "../schema";
import {
	CustomRequest,
	findUserById,
	createNewVendorProduct,
	findStoreByUserId,
} from "../services";
import { log } from "../utils";
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
			if (user.role === "vendor") {
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
}
