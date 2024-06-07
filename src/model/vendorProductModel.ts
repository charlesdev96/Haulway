import mongoose from "mongoose";
import {
	VenProductGeneralInfo,
	Price,
	Shipping,
	ProductReview,
	Inventory,
} from "../types";

export interface VendorProductInputs {
	genInfo?: VenProductGeneralInfo;
	productPrice?: Price;
	shippingAndDelivery?: Shipping;
	inventory?: Inventory;
	productReview?: ProductReview;
	vendor?: string;
	status?: "published" | "unpublished";
}

export interface VendorProductDocument
	extends VendorProductInputs,
		mongoose.Document {
	_id?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const validSizes = ["xs", "s", "m", "l", "xl", "xxl"];

const ProductSchema = new mongoose.Schema(
	{
		genInfo: {
			name: { type: String, required: true },
			brand: { type: String, required: true },
			colour: [{ type: String, required: true }],
			desc: { type: String, required: true },
			category: { type: String, required: true },
			size: {
				type: [{ type: String, enum: validSizes }],
				required: true,
			},

			gender: {
				type: String,
				enum: ["male", "femaile", "unisex"],
				required: true,
			},
			productVar: {
				variantColour: { type: [String], default: [] },
				variantQuantity: { type: Number, default: 0 },
				variantSize: {
					type: [{ type: String, enum: validSizes }],
					default: [],
				},
			},
		},
		productPrice: {
			basePrice: { type: Number, required: true },
			discountPrice: { type: Number },
			discount: { type: Number, default: 0 },
			discountType: { type: String },
			price: { type: Number },
		},
		shippingAndDelivery: {
			shippingOptions: {
				type: String,
				enum: ["dhl", "fedx", "ups"],
			},
			refundPolicy: { type: String, default: null },
		},
		inventory: {
			quantity: { type: Number, required: true },
			stockStatus: { type: String, required: true },
			productTags: [{ type: String, default: [] }],
		},
		productReview: { products: [{ type: String, required: true }] },
		vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		status: {
			type: String,
			enum: ["published", "unpublished"],
			default: "published",
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

export const VendorProductModel = mongoose.model<VendorProductDocument>(
	"VendorProduct",
	ProductSchema,
);
