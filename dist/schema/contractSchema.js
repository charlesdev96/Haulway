"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContractSchema = void 0;
const zod_1 = require("zod");
exports.createContractSchema = zod_1.z.object({
    body: zod_1.z.object({
        percentage: zod_1.z.number({
            required_error: "please provide the contract percentage",
        }),
        timeFrame: zod_1.z.string({
            required_error: "Please provide time frame of contract",
        }),
        vendor: zod_1.z.string().optional(),
        influencer: zod_1.z.string().optional(),
        products: zod_1.z.array(zod_1.z.string({ required_error: "please contract products" })),
    }),
});
