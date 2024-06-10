"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckPaymentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PaymentSchema = new mongoose_1.default.Schema({
    paymentIntentId: { type: String },
    productId: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "VendorProduct" }],
    buyer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    vendor: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", default: null },
    influencer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
});
exports.CheckPaymentModel = mongoose_1.default.model("PaymentStatus", PaymentSchema);
