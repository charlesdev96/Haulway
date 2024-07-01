"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItemModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CartItemSchema = new mongoose_1.default.Schema({
    cart: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Cart" },
    store: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Store" },
    post: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Post" },
    influencer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "VendorProduct",
    },
    quantity: { type: Number, default: 1 },
}, { timestamps: true });
exports.CartItemModel = mongoose_1.default.model("CartItem", CartItemSchema);
