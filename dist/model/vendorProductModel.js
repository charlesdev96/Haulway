"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorProductModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validSizes = ["xs", "s", "m", "l", "xl", "xxl"];
const ProductSchema = new mongoose_1.default.Schema({
    genInfo: {
        name: { type: String, required: true },
        brand: { type: String, required: true },
        colour: [{ type: String, required: true }],
        desc: { type: String, required: true },
        category: { type: String, required: true },
        size: {
            type: [{ type: String, enum: validSizes }],
            required: true,
        },
        gender: {
            type: String,
            enum: ["male", "femaile", "unisex"],
            required: true,
        },
        productVar: {
            variantColour: { type: [String], default: [] },
            variantQuantity: { type: Number, default: 0 },
            variantSize: {
                type: [{ type: String, enum: validSizes }],
                default: [],
            },
        },
    },
    productPrice: {
        basePrice: { type: Number, required: true },
        discountPrice: { type: Number },
        discount: { type: Number, default: 0 },
        discountType: { type: String },
        price: { type: Number },
    },
    shippingAndDelivery: {
        shippingOptions: {
            type: String,
            enum: ["dhl", "fedx", "ups"],
        },
        refundPolicy: { type: String, default: null },
    },
    inventory: {
        quantity: { type: Number, required: true },
        stockStatus: { type: String, required: true },
        productTags: [{ type: String, default: [] }],
    },
    productReview: { products: [{ type: String, required: true }] },
    vendor: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    buyers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    store: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Store" },
    status: {
        type: String,
        enum: ["published", "unpublished"],
        default: "published",
    },
    numOfProReviews: { type: Number, default: 0 },
    reviews: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "ProductReview" }],
    reviewers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    averageRating: { type: Number, default: 0 },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
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
exports.VendorProductModel = mongoose_1.default.model("VendorProduct", ProductSchema);
