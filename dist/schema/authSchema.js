"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        _id: zod_1.z.string().optional(),
        fullName: zod_1.z.string({
            required_error: "firstName is required",
        }),
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email({ message: "Invalid email address" }),
        password: zod_1.z
            .string({
            required_error: "Password is required",
        })
            .min(6, { message: "Password too short - should be 6 chars minimum" }),
        confirmPassword: zod_1.z.string({
            required_error: "confirmPassowrd is required",
        }),
        verificationCode: zod_1.z.string().optional(),
        passwordResetCode: zod_1.z.string().optional(),
    })
        .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }),
});
