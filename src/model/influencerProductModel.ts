import mongoose from "mongoose";
import { InProductGeneralInfo, Price, ProductReview } from "../types";

export interface InfluencerProductInputs {
	genInfo?: InProductGeneralInfo;
	productReview?: ProductReview;
	productPrice?: Price;
	influencer?: string;
	status?: "published" | "unpublished";
}

export interface InfluencerProductDocument
	extends InfluencerProductInputs,
		mongoose.Document {
	_id?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const ProductSchema = new mongoose.Schema(
	{
		status: {
			type: String,
			enum: ["published", "unpublished"],
			default: "published",
		},
		genInfo: {
			videoName: { type: String, required: true },
			videoType: { type: String, required: true },
			videoDesc: { type: String, required: true },
			videoCategory: { type: String, required: true },
		},
		productPrice: {
			basePrice: { type: Number, required: true },
			discountPrice: { type: Number },
			discount: { type: Number, default: 0 },
			discountType: { type: String },
			price: { type: Number },
		},
		productReview: { products: [{ type: String, required: true }] },
		influencer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

export const InfluencerProductModel = mongoose.model<InfluencerProductDocument>(
	"InfluencerProduct",
	ProductSchema,
);
