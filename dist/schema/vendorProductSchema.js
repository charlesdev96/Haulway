"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVendorProductSchema = exports.updateVendorProductSchema = exports.vendorProductSchema = void 0;
const zod_1 = require("zod");
const validSizes = ["xs", "s", "m", "l", "xl", "xxl"];
const prodVarSchema = zod_1.z.object({
    variantColour: zod_1.z.array(zod_1.z.string()).optional(),
    variantQuantity: zod_1.z.number().optional(),
    variantSize: zod_1.z.array(zod_1.z.enum(validSizes)).optional(),
});
const generalInformationSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: "product name is required" }),
    brand: zod_1.z.string({ required_error: "product brand is required" }),
    colour: zod_1.z.array(zod_1.z.string({ required_error: "product colour is required" })),
    desc: zod_1.z
        .string({ required_error: "product desc is required" })
        .min(3)
        .max(500),
    category: zod_1.z.string({ required_error: "product category is required" }),
    size: zod_1.z.array(zod_1.z.enum(validSizes), {
        required_error: "product size is required",
        invalid_type_error: "value provided not among those permitted",
    }),
    gender: zod_1.z.enum(["male", "female", "unisex"], {
        invalid_type_error: "value provided not among those permitted",
        required_error: "please provide gender",
    }),
    productVar: prodVarSchema,
});
const priceSchema = zod_1.z.object({
    basePrice: zod_1.z.number({ required_error: "base price is required" }),
    discount: zod_1.z.number().optional(),
    discountPrice: zod_1.z.number().optional(),
    discountType: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
});
const shippingSchema = zod_1.z.object({
    shippingOptions: zod_1.z.enum(["dhl", "fedex", "ups"]),
    refundPolicy: zod_1.z.string().optional(),
});
const inventorySchema = zod_1.z.object({
    quantity: zod_1.z.number({ required_error: "product quantity is required" }),
    stockStatus: zod_1.z.string({ required_error: "stock status is required" }),
    productTags: zod_1.z.array(zod_1.z.string()).optional(),
});
const productSchema = zod_1.z.object({
    products: zod_1.z.array(zod_1.z.string({ required_error: "product is required" })),
});
exports.vendorProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        genInfo: generalInformationSchema,
        productPrice: priceSchema,
        shippingAndDelivery: shippingSchema,
        inventory: inventorySchema,
        productReview: productSchema,
        vendor: zod_1.z.string().optional(),
        status: zod_1.z.enum(["published", "unpublished"]).optional(),
        store: zod_1.z.string().optional(),
    }),
});
exports.updateVendorProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        genInfo: zod_1.z
            .object({
            name: zod_1.z.string().optional(),
            brand: zod_1.z.string().optional(),
            colour: zod_1.z.array(zod_1.z.string()).optional(),
            desc: zod_1.z.string().min(3).max(500).optional(),
            category: zod_1.z.string().optional(),
            size: zod_1.z.array(zod_1.z.enum(validSizes)).optional(),
            gender: zod_1.z.enum(["male", "female", "unisex"]).optional(),
            productVar: prodVarSchema.optional(),
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
        shippingAndDelivery: zod_1.z
            .object({
            shippingOptions: zod_1.z.enum(["dhl", "fedex", "ups"]).optional(),
            refundPolicy: zod_1.z.string().optional(),
        })
            .optional(),
        inventory: zod_1.z
            .object({
            quantity: zod_1.z.number().optional(),
            stockStatus: zod_1.z.string().optional(),
            productTags: zod_1.z.array(zod_1.z.string()).optional(),
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
exports.deleteVendorProductSchema = zod_1.z.object({
    params: zod_1.z.object({
        productId: zod_1.z.string({ required_error: "product id is required" }),
    }),
});
