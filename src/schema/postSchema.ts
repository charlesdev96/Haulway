import { z } from "zod";

export const createUserPostSchema = z.object({
	body: z.object({
		content: z
			.array(z.string({ required_error: "post content is required" }))
			.nonempty({ message: "Content Can't be empty!" }),
		caption: z.string().optional(),
		options: z.enum(["haul", "lookbook", "diy", "grwm"], {
			required_error: "please choose an option",
		}),
		postedBy: z.string().optional(),
		tagPeople: z.array(z.string()).optional(),
		numOfPeopleTag: z.number().optional(),
		addCategory: z.array(z.string()).optional(),
	}),
});

export const createVendorPostSchema = z.object({
	body: z.object({
		content: z
			.array(z.string({ required_error: "post content is required" }))
			.nonempty({ message: "Content Can't be empty!" }),
		caption: z.string().optional(),
		options: z.enum(["haul", "lookbook", "diy", "grwm"], {
			required_error: "please choose an option",
		}),
		postedBy: z.string().optional(),
		tagPeople: z.array(z.string()).optional(),
		numOfPeopleTag: z.number().optional(),
		addCategory: z.array(z.string()).optional(),
		products: z.array(z.string()).optional(),
		numOfProducts: z.number().optional(),
	}),
});

export const getSinglePostSchema = z.object({
	params: z.object({
		postId: z.string({
			required_error: "Please provide post id",
		}),
	}),
});

export const updatePostSchema = z.object({
	body: z.object({
		content: z.array(z.string()).optional(),
		desc: z.string().optional(),
		tagPeople: z.array(z.string()).optional(),
		numOfPeopleTag: z.number().optional(),
		addCategory: z.array(z.string()).optional(),
		products: z.array(z.string()).optional(),
	}),
	params: z.object({
		postId: z.string({
			required_error: "Product Id is required",
		}),
	}),
});

export const deletePostSchema = z.object({
	params: z.object({
		postId: z.string({
			required_error: "Please provide the id of the post to be deleted",
		}),
	}),
});

export type createUserPostInputs = z.infer<typeof createUserPostSchema>["body"];

export type createVendorPostInputs = z.infer<
	typeof createVendorPostSchema
>["body"];

export type getSinglePostInputs = z.infer<typeof getSinglePostSchema>["params"];

export type updatePostInputs = z.infer<typeof updatePostSchema>;

export type deletePostInputs = z.infer<typeof deletePostSchema>["params"];
