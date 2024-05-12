"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z
            .array(zod_1.z.string())
            .nonempty({ message: "Content Can't be empty!" }),
        desc: zod_1.z.string().optional(),
        postedBy: zod_1.z.string().optional(),
        followingStatus: zod_1.z.enum(["following", "follow", "owner"]).optional(),
    }),
});
exports.updatePostSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.array(zod_1.z.string()).optional(),
        desc: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({
        postId: zod_1.z.string({
            required_error: "Product Id is required",
        }),
    }),
});
