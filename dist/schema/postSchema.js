"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z
            .array(zod_1.z.string())
            .nonempty({ message: "Content Can't be empty!" }),
        desc: zod_1.z.string().optional(),
        postedBy: zod_1.z.string().optional(),
    }),
});
