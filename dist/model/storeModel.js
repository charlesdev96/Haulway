"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const StoreSchema = new mongoose_1.default.Schema({
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
    stripeId: {
        type: String,
        default: null,
    },
    stripeUrl: {
        type: String,
        default: null,
    },
    storeDesc: {
        type: String,
        default: "",
    },
    role: { type: String },
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    numOfProducts: { type: Number, default: 0 },
    numOfOrders: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    productSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalOrdersDelivered: { type: Number, default: 0 },
    numOfPendingOrders: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalOrderAmount: { type: Number, default: 0 },
    pendingOrders: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Order" }],
    ordersDelivered: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Order" }],
    orders: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Order" }],
    products: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "VendorProduct" }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Transform to uppercase for easy comparison and uniqueness before saving
StoreSchema.pre("save", function (next) {
    this.storeName = this.storeName.trim().replace(/\s+/g, " ").toUpperCase();
    next();
});
exports.StoreModel = mongoose_1.default.model("Store", StoreSchema);
