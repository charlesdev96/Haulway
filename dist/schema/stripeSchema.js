"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboardUserSchema = void 0;
const zod_1 = require("zod");
exports.onboardUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        country: zod_1.z.string({
            required_error: "please provide country of residence",
        }),
    }),
});
