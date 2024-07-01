import mongoose from "mongoose";

export interface CartItemInputs {
	cart?: string;
	store?: string;
	product?: string;
	post?: string;
	influencer?: string | null;
	quantity?: number | 1;
}

export interface CartItemDocument extends CartItemInputs, mongoose.Document {
	_id?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const CartItemSchema = new mongoose.Schema(
	{
		cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
		store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
		post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
		influencer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "VendorProduct",
		},
		quantity: { type: Number, default: 1 },
	},
	{ timestamps: true },
);

export const CartItemModel = mongoose.model<CartItemDocument>(
	"CartItem",
	CartItemSchema,
);
