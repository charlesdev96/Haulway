"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItemSchema = exports.updateCartSchema = exports.addItemToCartSchema = void 0;
const zod_1 = require("zod");
exports.addItemToCartSchema = zod_1.z.object({
    body: zod_1.z.object({
        cart: zod_1.z.string().optional(),
        store: zod_1.z.string().optional(),
        product: zod_1.z.string().optional(),
        quantity: zod_1.z.number({ required_error: "please provide item quantity" }),
    }),
    params: zod_1.z.object({
        productId: zod_1.z.string({ required_error: "productId is required" }),
    }),
});
exports.updateCartSchema = zod_1.z.object({
    body: zod_1.z.object({
        quantity: zod_1.z.number().optional(),
    }),
    params: zod_1.z.object({
        productId: zod_1.z.string({ required_error: "product id required" }),
    }),
});
exports.removeItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        productId: zod_1.z.string({ required_error: "product id required" }),
    }),
});
