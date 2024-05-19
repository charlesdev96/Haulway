"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReplySchema = exports.editReplySchema = exports.createreplySchema = void 0;
const zod_1 = require("zod");
exports.createreplySchema = zod_1.z.object({
    body: zod_1.z.object({
        reply: zod_1.z.string({ required_error: "Please leave a reply on the comment" }),
        comment: zod_1.z.string().optional(),
        replier: zod_1.z.string().optional(),
        post: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({
        commentId: zod_1.z.string({
            required_error: "Please provide the id of the comment",
        }),
        postId: zod_1.z.string({
            required_error: "Please provide the id of the Post",
        }),
    }),
});
exports.editReplySchema = zod_1.z.object({
    body: zod_1.z.object({
        reply: zod_1.z.string({
            required_error: "Please provide the reply",
        }),
    }),
    params: zod_1.z.object({
        replyId: zod_1.z.string({
            required_error: "Please provide the id of the reply",
        }),
    }),
});
exports.deleteReplySchema = zod_1.z.object({
    params: zod_1.z.object({
        replyId: zod_1.z.string({
            required_error: "Please provide the id of the reply",
        }),
    }),
});
