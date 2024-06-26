"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ContractSchema = new mongoose_1.default.Schema({
    percentage: { type: Number, required: true },
    timeFrame: { type: String, required: true },
    vendor: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    influencer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    actionType: {
        type: String,
        enum: ["accepted", "negotiate", "declined", "pending"],
        default: "pending",
    },
    status: {
        type: String,
        enum: ["completed", "active", "in-active"],
        default: "in-active",
    },
    completionDate: { type: Date, default: null },
    sentBy: { type: String },
    products: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "VendorProduct" }],
}, { timestamps: true });
exports.ContractModel = mongoose_1.default.model("Contract", ContractSchema);
