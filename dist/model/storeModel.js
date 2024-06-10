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
    storeDesc: {
        type: String,
        default: "",
    },
    role: { type: String },
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    products: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "VendorProduct" }],
    influencerProducts: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "InfluencerProduct" },
    ],
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
