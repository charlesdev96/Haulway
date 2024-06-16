"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostReviewSchema = exports.deletecommentSchema = exports.updateCommentSchema = exports.createCommentSchema = void 0;
const zod_1 = require("zod");
exports.createCommentSchema = zod_1.z.object({
    body: zod_1.z.object({
        comment: zod_1.z.string({ required_error: "Please leave a comment" }),
        commentedBy: zod_1.z.string().optional(),
        post: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({
        postId: zod_1.z.string({
            required_error: "Please provide the id of the post",
        }),
    }),
});
exports.updateCommentSchema = zod_1.z.object({
    body: zod_1.z.object({
        comment: zod_1.z.string().min(1).optional(),
    }),
    params: zod_1.z.object({
        commentId: zod_1.z.string({
            required_error: "Please provide the Id of the comment",
        }),
    }),
});
exports.deletecommentSchema = zod_1.z.object({
    params: zod_1.z.object({
        commentId: zod_1.z.string({
            required_error: "Please provide id of the comment to be deleted",
        }),
    }),
});
exports.getPostReviewSchema = zod_1.z.object({
    params: zod_1.z.object({
        postId: zod_1.z.string({ required_error: "post id required" }),
    }),
});
