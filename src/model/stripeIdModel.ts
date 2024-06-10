import mongoose from "mongoose";
import { PaymentIntentInputs } from "../types";

export interface PaymentIntentDocument
	extends PaymentIntentInputs,
		mongoose.Document {
	id?: string;
	createdAt?: string;
	updatedAt?: string;
}

const PaymentSchema = new mongoose.Schema({
	paymentIntentId: { type: String },
	productId: [{ type: mongoose.Schema.Types.ObjectId, ref: "VendorProduct" }],
	buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
	influencer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		default: null,
	},
});

export const CheckPaymentModel = mongoose.model<PaymentIntentDocument>(
	"PaymentStatus",
	PaymentSchema,
);
