"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.influencerProductSchema = void 0;
const zod_1 = require("zod");
const generalInformationSchema = zod_1.z.object({
    videoName: zod_1.z.string({ required_error: "video name is required" }),
    videoType: zod_1.z.string({ required_error: "video type is required" }),
    videoDesc: zod_1.z
        .string({ required_error: "video desc is required" })
        .min(3)
        .max(500),
    videoCategory: zod_1.z.string({ required_error: "video name is required" }),
});
const priceSchema = zod_1.z.object({
    basePrice: zod_1.z.number({ required_error: "base price is required" }),
    discount: zod_1.z.number().optional(),
    discountPrice: zod_1.z.number().optional(),
    discountType: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
});
const productSchema = zod_1.z.object({
    products: zod_1.z.array(zod_1.z.string({ required_error: "product " })),
});
exports.influencerProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        genInfo: generalInformationSchema,
        productPrice: priceSchema,
        productReview: productSchema,
        influencer: zod_1.z.string().optional(),
        status: zod_1.z.enum(["published", "unpublished"]).optional(),
    }),
});
