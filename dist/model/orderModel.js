"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const OrderSchema = new mongoose_1.default.Schema({
    subTotal: { type: Number },
    shippingInfo: { type: Number },
    totalAmount: { type: Number },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    vendor: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    influencer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    products: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "VendorProduct" }],
    store: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Store" },
    influencerStore: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.OrderModel = mongoose_1.default.model("Order", OrderSchema);
