"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradeAccountSchema = exports.updateStoreSchema = exports.createStoreSchema = exports.deleteAccountSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().optional(),
        userName: zod_1.z.string().optional(),
        profilePic: zod_1.z.string().url().optional(),
        password: zod_1.z.string().min(6).optional(),
        oldPassword: zod_1.z.string().optional(),
    }),
});
exports.deleteAccountSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Please provide an email",
        })
            .email({ message: "Please provide a valid email" }),
    }),
});
exports.createStoreSchema = zod_1.z.object({
    role: zod_1.z.string().optional(),
    owner: zod_1.z.string().optional(),
    storeName: zod_1.z
        .string({
        required_error: "Please provide a name for your store",
    })
        .min(3)
        .max(50)
        .trim(),
    storeLogo: zod_1.z.string({ required_error: "store logo is required" }),
    currency: zod_1.z.string().optional(),
});
exports.updateStoreSchema = zod_1.z.object({
    body: zod_1.z.object({
        storeName: zod_1.z.string().min(3).max(50).optional(),
        storeLogo: zod_1.z.string().optional(),
        storeDesc: zod_1.z.string().min(3).max(100).optional(),
    }),
});
exports.upgradeAccountSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.enum(["admin", "influencer", "user", "vendor", "tutor"], {
            message: "Please provide your role",
        }),
        store: exports.createStoreSchema.optional(),
    }),
});
