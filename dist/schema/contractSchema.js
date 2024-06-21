"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.influencerReplyRequestSchema = exports.replyRequestSchema = exports.createInfluencerContractSchema = exports.createContractSchema = void 0;
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
        influencer: zod_1.z.string({ required_error: "please provide the influencer" }),
        products: zod_1.z.array(zod_1.z.string({ required_error: "please contract products" })),
    }),
});
exports.createInfluencerContractSchema = zod_1.z.object({
    body: zod_1.z.object({
        percentage: zod_1.z.number({
            required_error: "please provide the contract percentage",
        }),
        timeFrame: zod_1.z.string({
            required_error: "Please provide time frame of contract",
        }),
        influencer: zod_1.z.string().optional(),
        vendor: zod_1.z.string({ required_error: "please provide the vendor" }),
        products: zod_1.z.array(zod_1.z.string({ required_error: "please contract products" })),
    }),
});
exports.replyRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        actionType: zod_1.z.enum(["accepted", "negotiate", "declined", "pending"], {
            required_error: "please provide a reply",
        }),
        percentage: zod_1.z.number().optional(),
        timeFrame: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({
        contractId: zod_1.z.string({ required_error: "please provide the request id" }),
    }),
});
exports.influencerReplyRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        actionType: zod_1.z.enum(["accepted", "negotiate", "declined", "pending"], {
            required_error: "please provide a reply",
        }),
        percentage: zod_1.z.number().optional(),
        timeFrame: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({
        contractId: zod_1.z.string({ required_error: "please provide the request id" }),
    }),
});
