import mongoose from "mongoose";

export interface CartItemInputs {
	cart?: string;
	product?: string;
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
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
		},
		quantity: { type: Number, default: 1 },
	},
	{ timestamps: true },
);

export const CartItemModel = mongoose.model<CartItemDocument>(
	"CartItem",
	CartItemSchema,
);
