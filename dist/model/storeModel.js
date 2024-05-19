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
        unique: [true, "Store name must be unique"],
        required: [true, "Please provide a store name"],
    },
    currency: {
        type: String,
        required: [true, "Please provide a currency"],
    },
    storeLogo: {
        type: String,
        required: [true, "Please provide a store logo"],
    },
    role: { type: String },
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    products: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Product" }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Transform to uppercase for easy comparison and uniqueness before saving
StoreSchema.pre("save", function (next) {
    this.storeName = this.storeName.toUpperCase();
    next();
});
exports.StoreModel = mongoose_1.default.model("Store", StoreSchema);
