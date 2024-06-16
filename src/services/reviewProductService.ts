import { ProductReviewModel } from "../model";
import { ProductReviewInputs } from "../types";

export const createProductReview = async (input: ProductReviewInputs) => {
	return await ProductReviewModel.create(input);
};
