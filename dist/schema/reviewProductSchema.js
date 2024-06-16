"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewProductSchema = void 0;
const zod_1 = require("zod");
exports.reviewProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        comment: zod_1.z.string().optional(),
        rating: zod_1.z.number().min(1).max(5).optional(),
        reviewer: zod_1.z.string().optional(),
        product: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({
        productId: zod_1.z.string({ required_error: "product id is required" }),
    }),
});
