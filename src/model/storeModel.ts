import mongoose from "mongoose";

export interface StoreInputs {
	products?: string[];
	storeName?: string;
	currency?: string;
	storeLogo?: string;
	owner?: string;
	role?: string;
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
		role: { type: String },
		owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
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
