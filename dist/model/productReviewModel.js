"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReviewModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ProductReviewSchema = new mongoose_1.default.Schema({
    comment: { type: String },
    rating: { type: Number },
    reviewer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "VendorProduct" },
}, { timestamps: true });
exports.ProductReviewModel = mongoose_1.default.model("ProductReview", ProductReviewSchema);
