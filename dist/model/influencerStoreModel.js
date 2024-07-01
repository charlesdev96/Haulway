"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluencerStoreModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const InfluencerStoreSchema = new mongoose_1.default.Schema({
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
    influencerProducts: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "InfluencerProduct" },
    ],
    numOfProducts: { type: Number, default: 0 },
    accountReached: { type: Number, default: 0 },
    accountEngaged: { type: Number, default: 0 },
    numOfOrders: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    orders: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Order" }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Transform to uppercase for easy comparison and uniqueness before saving
InfluencerStoreSchema.pre("save", function (next) {
    this.storeName = this.storeName.trim().replace(/\s+/g, " ").toUpperCase();
    next();
});
exports.InfluencerStoreModel = mongoose_1.default.model("InfluencerStore", InfluencerStoreSchema);
