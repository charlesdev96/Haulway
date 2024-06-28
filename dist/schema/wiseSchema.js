"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileSchema = void 0;
const zod_1 = require("zod");
exports.createProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string({ required_error: "firstName required" }),
        lastName: zod_1.z.string({ required_error: "lastName is required" }),
        dateOfBirth: zod_1.z.string({ required_error: "dateOfBirth is required" }),
        phoneNumber: zod_1.z.string({ required_error: "phoneNumber is required" }),
        email: zod_1.z.string({ required_error: "email is required" }),
        walletId: zod_1.z.string().optional(),
        profileId: zod_1.z.string().optional(),
    }),
});
