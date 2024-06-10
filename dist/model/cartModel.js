"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CartSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    store: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Store" },
    items: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "CartItem" }],
}, { timestamps: true });
exports.CartModel = mongoose_1.default.model("Cart", CartSchema);
