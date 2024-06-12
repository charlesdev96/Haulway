import mongoose from "mongoose";

export interface CartInputs {
	user?: string;
	cartItems?: string[];
}

export interface CartDocuments extends CartInputs, mongoose.Document {
	_id?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const CartSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		cartItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartItem" }],
	},
	{ timestamps: true },
);

export const CartModel = mongoose.model<CartDocuments>("Cart", CartSchema);
