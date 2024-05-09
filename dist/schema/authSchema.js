"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyresetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.verifyUserSchema = exports.registerUserSchema = void 0;
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
exports.verifyUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string(),
        verificationCode: zod_1.z.string(),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email({ message: "Invalid email address" }),
        password: zod_1.z
            .string({
            required_error: "Password is required",
        })
            .min(6, "Invalid email or password"),
    }),
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email({ message: "Invalid email address" }),
        password: zod_1.z
            .string({
            required_error: "Password is required",
        })
            .min(6, "Invalid email or password"),
        confirmPassword: zod_1.z.string({
            required_error: "confirmPassowrd is required",
        }),
    })
        .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }),
});
exports.verifyresetPasswordSchema = zod_1.z.object({
    query: zod_1.z.object({
        id: zod_1.z.string(),
        passwordCode: zod_1.z.string(),
        password: zod_1.z.string(),
        email: zod_1.z.string(),
    }),
});
