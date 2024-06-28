import mongoose from "mongoose";

export interface OrderInput {
	user?: string;
	vendor?: string;
	influencer?: string | null;
	products?: string[];
	store?: string;
	influencerStore?: string;
	status?:
		| "pending"
		| "completed"
		| "failed"
		| "cancelled"
		| "refunded"
		| "on-hold";
	shippingStatus?: "fulfilled" | "unfulfilled";
	refund?: boolean | null;
	refunded?: boolean | null;
	reasonForRefund?: string | "" | null;
	received?: boolean;
	address?: string;
	postalCode?: string;
	subTotal?: number;
	shippingInfo?: number;
	totalAmount?: number;
}

export interface OrderDocument extends OrderInput, mongoose.Document {
	_id?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const OrderSchema = new mongoose.Schema({
	subTotal: { type: Number },
	shippingInfo: { type: Number },
	totalAmount: { type: Number },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	influencer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	products: [{ type: mongoose.Schema.Types.ObjectId, ref: "VendorProduct" }],
	store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
	influencerStore: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "InfluencerStore",
	},
	status: {
		type: String,
		enum: [
			"pending",
			"completed",
			"failed",
			"cancelled",
			"refunded",
			"on-hold",
		],
	},
	shippingStatus: { type: String, enum: ["fulfilled", "unfulfilled"] },
	refund: { type: Boolean },
	refunded: { type: Boolean },
	received: { type: Boolean, default: false },
	address: { type: String, default: "" },
	postalCode: { type: String, default: "" },
	reasonForRefund: { type: String, default: null },
});

export const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);
