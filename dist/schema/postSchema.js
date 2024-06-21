"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostByOptionSchema = exports.savePostSchema = exports.deletePostSchema = exports.updatePostSchema = exports.getSinglePostSchema = exports.createVendorPostSchema = exports.createUserPostSchema = void 0;
const zod_1 = require("zod");
exports.createUserPostSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z
            .array(zod_1.z.string({ required_error: "post content is required" }))
            .nonempty({ message: "Content Can't be empty!" }),
        caption: zod_1.z.string().optional(),
        options: zod_1.z.enum(["haul", "lookbook", "diy", "grwm"], {
            required_error: "please choose an option",
        }),
        postedBy: zod_1.z.string().optional(),
        thumbNail: zod_1.z.array(zod_1.z.string()).optional(),
        tagPeople: zod_1.z.array(zod_1.z.string()).optional(),
        numOfPeopleTag: zod_1.z.number().optional(),
        addCategory: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.createVendorPostSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z
            .array(zod_1.z.string({ required_error: "post content is required" }))
            .nonempty({ message: "Content Can't be empty!" }),
        caption: zod_1.z.string().optional(),
        options: zod_1.z.enum(["haul", "lookbook", "diy", "grwm"], {
            required_error: "please choose an option",
        }),
        postedBy: zod_1.z.string().optional(),
        thumbNail: zod_1.z.array(zod_1.z.string()).optional(),
        tagPeople: zod_1.z.array(zod_1.z.string()).optional(),
        numOfPeopleTag: zod_1.z.number().optional(),
        addCategory: zod_1.z.array(zod_1.z.string()).optional(),
        products: zod_1.z.array(zod_1.z.string()).optional(),
        numOfProducts: zod_1.z.number().optional(),
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
        caption: zod_1.z.string().optional(),
        options: zod_1.z.enum(["haul", "lookbook", "diy", "grwm"]).optional(),
        tagPeople: zod_1.z.array(zod_1.z.string()).optional(),
        numOfPeopleTag: zod_1.z.number().optional(),
        addCategory: zod_1.z.array(zod_1.z.string()).optional(),
        products: zod_1.z.array(zod_1.z.string()).optional(),
        numOfProducts: zod_1.z.number().optional(),
        thumbNail: zod_1.z.array(zod_1.z.string()).optional(),
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
exports.savePostSchema = zod_1.z.object({
    params: zod_1.z.object({
        postId: zod_1.z.string({ required_error: "post id required" }),
    }),
});
exports.getPostByOptionSchema = zod_1.z.object({
    query: zod_1.z.object({
        option: zod_1.z.enum(["haul", "lookbook", "diy", "grwm"], {
            required_error: "please choose one of the available option",
        }),
    }),
});
