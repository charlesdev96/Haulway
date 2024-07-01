import mongoose from "mongoose";

export interface StoreInputs {
	products?: string[];
	stripeId?: string;
	stripeUrl?: string;
	storeName?: string;
	currency?: string;
	storeLogo?: string;
	storeDesc?: string | "";
	owner?: string;
	role?: string;
	numOfProducts?: number;
	numOfOrders?: number;
	revenue?: number;
	productSales?: number;
	totalOrders?: number; //totalOrders = totalOrdersDelivered + numOfPendingOrders
	totalOrdersDelivered?: number;
	numOfPendingOrders?: number;
	totalSales?: number; // totalOrdersDelivered
	totalOrderAmount?: number; //totalOrders
	pendingOrders?: string[];
	ordersDelivered?: string[];
	orders?: string[];
}

export interface StoreDocument extends StoreInputs, mongoose.Document {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
}

const StoreSchema = new mongoose.Schema(
	{
		storeName: {
			type: String,
			unique: true,
			required: [true, "Please provide a store name"],
			trim: true,
		},
		currency: {
			type: String,
			default: "USD",
		},
		storeLogo: {
			type: String,
		},
		stripeId: {
			type: String,
			default: null,
		},
		stripeUrl: {
			type: String,
			default: null,
		},
		storeDesc: {
			type: String,
			default: "",
		},
		role: { type: String },
		owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		numOfProducts: { type: Number, default: 0 },
		numOfOrders: { type: Number, default: 0 },
		revenue: { type: Number, default: 0 },
		productSales: { type: Number, default: 0 },
		totalOrders: { type: Number, default: 0 },
		totalOrdersDelivered: { type: Number, default: 0 },
		numOfPendingOrders: { type: Number, default: 0 },
		totalSales: { type: Number, default: 0 },
		totalOrderAmount: { type: Number, default: 0 },
		pendingOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
		ordersDelivered: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
		orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
		products: [{ type: mongoose.Schema.Types.ObjectId, ref: "VendorProduct" }],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Transform to uppercase for easy comparison and uniqueness before saving
StoreSchema.pre("save", function (next) {
	this.storeName = this.storeName.trim().replace(/\s+/g, " ").toUpperCase();
	next();
});

export const StoreModel = mongoose.model<StoreDocument>("Store", StoreSchema);
