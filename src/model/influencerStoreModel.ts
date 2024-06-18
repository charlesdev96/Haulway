import mongoose from "mongoose";

export interface InfluencerStoreInputs {
	influencerProducts?: string[];
	storeName?: string;
	currency?: string;
	storeLogo?: string;
	storeDesc?: string | "";
	owner?: string;
	role?: string;
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
		storeDesc: {
			type: String,
			default: "",
		},
		role: { type: String },
		owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		influencerProducts: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "InfluencerProduct" },
		],
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
