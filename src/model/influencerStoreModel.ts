import mongoose from "mongoose";

export interface InfluencerStoreInputs {
	influencerProducts?: string[];
	walletId?: string;
	profileId?: string;
	accountId?: string;
	storeName?: string;
	currency?: string;
	storeLogo?: string;
	storeDesc?: string | "";
	owner?: string;
	role?: string;
	numOfProducts?: number;
	revenue?: number;
	accountReached?: number;
	accountEngaged?: number;
	numOfOrders?: number;
	orders?: string[];
}

export interface InfluencerStroreDocument
	extends InfluencerStoreInputs,
		mongoose.Document {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
}

const InfluencerStoreSchema = new mongoose.Schema(
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
		walletId: {
			type: String,
			default: null,
		},
		profileId: {
			type: String,
			default: null,
		},
		accountId: {
			type: String,
			default: null,
		},
		storeDesc: {
			type: String,
			default: "",
		},
		role: { type: String },
		owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		influencerProducts: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "InfluencerProduct" },
		],
		numOfProducts: { type: Number, default: 0 },
		accountReached: { type: Number, default: 0 },
		accountEngaged: { type: Number, default: 0 },
		numOfOrders: { type: Number, default: 0 },
		revenue: { type: Number, default: 0 },
		orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Transform to uppercase for easy comparison and uniqueness before saving
InfluencerStoreSchema.pre("save", function (next) {
	this.storeName = this.storeName.trim().replace(/\s+/g, " ").toUpperCase();
	next();
});

export const InfluencerStoreModel = mongoose.model<InfluencerStroreDocument>(
	"InfluencerStore",
	InfluencerStoreSchema,
);
