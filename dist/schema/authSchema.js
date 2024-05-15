"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.verifyPasswordOtpSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.verifyUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    body: zod_1.z.object({
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
        otp: zod_1.z.number().optional(),
        forgotPasswordOtp: zod_1.z.number().optional(),
        otpExpirationDate: zod_1.z.date().nullable().optional(),
    }),
});
exports.verifyUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        otp: zod_1.z.number({ required_error: "Please provide missing otp" }),
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
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email({ message: "Invalid email address" }),
    }),
});
exports.verifyPasswordOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        otp: zod_1.z
            .number({
            required_error: "Please provide otp and it must be 5 digits",
        })
            .min(5)
            .max(5),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z
            .string({
            required_error: "Please provide a valid password",
        })
            .min(6),
    }),
});
