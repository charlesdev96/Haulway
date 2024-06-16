import { Response } from "express";
import {
	createProductReview,
	CustomRequest,
	findUserById,
	findVendorProductById,
} from "../services";
import { reviewProductInputs } from "../schema";
import { log } from "../utils";
import { StatusCodes } from "http-status-codes";

export class ProductReviewController {
	public async productReview(req: CustomRequest, res: Response) {
		try {
			const body = req.body as reviewProductInputs["body"];
			const { productId } = req.params as reviewProductInputs["params"];
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			//check if user has bought the product
			const product = await findVendorProductById(productId);
			if (!product) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "product not found" });
			}
			//check if user has already bought the course
			const alreadyBoughtProduct = product.buyers?.includes(userId.toString());
			if (
				!alreadyBoughtProduct &&
				product.vendor?.toString() !== userId.toString()
			) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					message:
						"Sorry, you can't review this product because you haven't purchased it yet.",
				});
			}
			//check if user has reviewed before
			const alreadyReviewedProduct = product.reviewers?.includes(
				userId.toString(),
			);
			//product owners can also comment on a post
			if (alreadyReviewedProduct) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					message:
						"Sorry, you can't review this product because you have already reviewed it before.",
				});
			}
			//proceed to review product
			if (!body.comment && !body.rating) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Please provide comment or rating" });
			}
			body.product = productId;
			body.reviewer = userId;
			const review = await createProductReview(body);
			//calculate product rating
			const currentRating = product.averageRating || 0;
			const currentNumReviews = product.numOfProReviews || 0;
			const newNumOfReviews = currentNumReviews + 1;
			const rating = body.rating || 0;
			const totalRating = currentRating * currentNumReviews;
			const newAverageRating = (totalRating + rating) / newNumOfReviews;
			product.averageRating = newAverageRating;
			//save the new product details
			await product.reviews?.push(review._id);
			product.numOfProReviews = product.reviews?.length;
			await product.reviewers?.push(userId);
			await product.save();
			res.status(StatusCodes.CREATED).json({
				success: true,
				message: "Congratulations, you have successfully reviewed this product",
				data: review,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				if (error.name === "CastError") {
					return res.status(StatusCodes.BAD_REQUEST).json({
						success: false,
						message: "Invalid review ID format.",
					});
				}
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to create a review on product due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while reviewing product",
				});
			}
		}
	}
}
