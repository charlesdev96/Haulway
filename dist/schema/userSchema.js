"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUserSchema = exports.getSingleUserSchema = void 0;
const zod_1 = require("zod");
exports.getSingleUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({
            required_error: "Please provide the id of the user",
        }),
    }),
});
exports.searchUserSchema = zod_1.z.object({
    query: zod_1.z.object({
        search: zod_1.z.string({ required_error: "please provide a search criteria" }),
    }),
});
