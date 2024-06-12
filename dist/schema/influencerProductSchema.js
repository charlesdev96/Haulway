"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInfluencerProductSchema = exports.influencerProductSchema = void 0;
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
        store: zod_1.z.string().optional(),
        influencer: zod_1.z.string().optional(),
        status: zod_1.z.enum(["published", "unpublished"]).optional(),
    }),
});
exports.updateInfluencerProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        genInfo: zod_1.z
            .object({
            videoName: zod_1.z.string().optional(),
            videoType: zod_1.z.string().optional(),
            videoDesc: zod_1.z.string().min(3).max(500).optional(),
            videoCategory: zod_1.z.string().optional(),
        })
            .optional(),
        productPrice: zod_1.z
            .object({
            basePrice: zod_1.z.number().optional(),
            discount: zod_1.z.number().optional(),
            discountPrice: zod_1.z.number().optional(),
            discountType: zod_1.z.string().optional(),
            price: zod_1.z.number().optional(),
        })
            .optional(),
        productReview: zod_1.z
            .object({
            products: zod_1.z.array(zod_1.z.string()).optional(),
        })
            .optional(),
    }),
    params: zod_1.z.object({
        productId: zod_1.z.string({ required_error: "product id is required" }),
    }),
});
