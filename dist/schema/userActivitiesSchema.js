"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followerUserSchema = void 0;
const zod_1 = require("zod");
exports.followerUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        targetUserId: zod_1.z.string({
            required_error: "Please provide the id of the user you want to follow",
        }),
    }),
});
