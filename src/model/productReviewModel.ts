import mongoose from "mongoose";
import { ProductReviewInputs } from "../types";

export interface ProductReviewDocument
	extends ProductReviewInputs,
		mongoose.Document {
	_id?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const ProductReviewSchema = new mongoose.Schema(
	{
		comment: { type: String },
		rating: { type: Number },
		reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		product: { type: mongoose.Schema.Types.ObjectId, ref: "VendorProduct" },
	},
	{ timestamps: true },
);

export const ProductReviewModel = mongoose.model<ProductReviewDocument>(
	"ProductReview",
	ProductReviewSchema,
);
