"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createreplySchema = void 0;
const zod_1 = require("zod");
exports.createreplySchema = zod_1.z.object({
    body: zod_1.z.object({
        reply: zod_1.z.string({ required_error: "Please leave a reply on the comment" }),
        comment: zod_1.z.string().optional(),
        replier: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({
        commentId: zod_1.z.string({
            required_error: "Please provide the id of the comment",
        }),
    }),
});
