import mongoose from "mongoose";

export interface ContractInputs {
	percentage?: number;
	timeFrame?: string;
	vendor?: string;
	influencer?: string;
	status?: "accepted" | "negotiating" | "declined" | "pending";
	contractStatus?: "completed" | "active" | "in-active";
	products?: string[];
}

export interface ContractDocument extends ContractInputs, mongoose.Document {
	_id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	completionDate?: Date | null;
}

const ContractSchema = new mongoose.Schema(
	{
		percentage: { type: Number, required: true },
		timeFrame: { type: String, required: true },
		vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		influencer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		status: {
			type: String,
			enum: ["accepted", "negotiating", "declined", "pending"],
			default: "pending",
		},
		contractStatus: {
			type: String,
			enum: ["completed", "active", "in-active"],
			default: "in-active",
		},
		completionDate: { type: Date, default: null },
		products: [{ type: mongoose.Schema.Types.ObjectId, ref: "VendorProduct" }],
	},
	{ timestamps: true },
);

export const ContractModel = mongoose.model<ContractDocument>(
	"Contract",
	ContractSchema,
);
