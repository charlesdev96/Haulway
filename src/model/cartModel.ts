import mongoose from "mongoose";

export interface CartInputs {
	user?: string;
	store?: string;
	items?: string[];
}

export interface CartDocuments extends CartInputs, mongoose.Document {
	_id?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const CartSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
		items: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartItem" }],
	},
	{ timestamps: true },
);

export const CartModel = mongoose.model<CartDocuments>("Cart", CartSchema);
