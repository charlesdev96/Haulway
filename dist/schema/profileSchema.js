"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        fullName: zod_1.z.string().optional(),
        userName: zod_1.z.string().optional(),
        profilePic: zod_1.z.string().optional(),
        role: zod_1.z
            .enum(["admin", "influencer", "user", "vendor", "tutor"])
            .optional(),
        password: zod_1.z.string().optional(),
        confirmPassword: zod_1.z.string().optional(),
        oldPassword: zod_1.z.string().optional(),
    })
        .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }),
});
