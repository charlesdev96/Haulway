"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostSchema = exports.updatePostSchema = exports.getSinglePostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
const GoogleLocationSchema = zod_1.z.object({
    address: zod_1.z.string().optional(),
});
const LocationSchema = zod_1.z.object({
    zipCode: zod_1.z.string().optional(),
    landMark: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
});
const AddLocationSchema = zod_1.z
    .union([LocationSchema, GoogleLocationSchema])
    .nullable();
exports.createPostSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z
            .array(zod_1.z.string())
            .nonempty({ message: "Content Can't be empty!" }),
        desc: zod_1.z.string().optional(),
        postedBy: zod_1.z.string().optional(),
        tagPeople: zod_1.z.array(zod_1.z.string()).optional(),
        numOfPeopleTag: zod_1.z.number().optional(),
        addLocation: AddLocationSchema.optional(),
        addMusic: zod_1.z.string().optional(),
        addCategory: zod_1.z.array(zod_1.z.string()).optional(),
        products: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.getSinglePostSchema = zod_1.z.object({
    params: zod_1.z.object({
        postId: zod_1.z.string({
            required_error: "Please provide post id",
        }),
    }),
});
exports.updatePostSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.array(zod_1.z.string()).optional(),
        desc: zod_1.z.string().optional(),
        tagPeople: zod_1.z.array(zod_1.z.string()).optional(),
        numOfPeopleTag: zod_1.z.number().optional(),
        addLocation: AddLocationSchema.optional(),
        addMusic: zod_1.z.string().optional(),
        addCategory: zod_1.z.array(zod_1.z.string()).optional(),
        products: zod_1.z.array(zod_1.z.string()).optional(),
    }),
    params: zod_1.z.object({
        postId: zod_1.z.string({
            required_error: "Product Id is required",
        }),
    }),
});
exports.deletePostSchema = zod_1.z.object({
    params: zod_1.z.object({
        postId: zod_1.z.string({
            required_error: "Please provide the id of the post to be deleted",
        }),
    }),
});
