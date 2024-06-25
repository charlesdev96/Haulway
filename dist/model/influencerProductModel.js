"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluencerProductModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    status: {
        type: String,
        enum: ["published", "unpublished"],
        default: "published",
    },
    genInfo: {
        videoName: { type: String, required: true },
        videoType: { type: String, required: true },
        videoDesc: { type: String, required: true },
        videoCategory: { type: String, required: true },
    },
    productPrice: {
        basePrice: { type: Number, required: true },
        discountPrice: { type: Number },
        discount: { type: Number, default: 0 },
        discountType: { type: String },
        price: { type: Number },
    },
    productReview: { products: [{ type: String, required: true }] },
    influencer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    store: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "InfluencerStore" },
    buyers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Pre-save hook to format the discountPrice and price
ProductSchema.pre("save", function (next) {
    if (this.productPrice) {
        const { basePrice, discount } = this.productPrice;
        if (basePrice !== undefined && discount !== undefined) {
            const discountedPrice = (1 - discount) * basePrice;
            this.productPrice.discountPrice = Number(parseFloat(discountedPrice.toFixed(2)));
            this.productPrice.price = this.productPrice.discountPrice;
        }
    }
    next();
});
exports.InfluencerProductModel = mongoose_1.default.model("InfluencerProduct", ProductSchema);
