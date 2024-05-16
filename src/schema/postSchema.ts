import { z } from "zod";

export const createPostSchema = z.object({
	body: z.object({
		content: z
			.array(z.string())
			.nonempty({ message: "Content Can't be empty!" }),
		desc: z.string().optional(),
		postedBy: z.string().optional(),
		tagPeople: z.array(z.string()).optional(),
		addLocation: z.object({}).optional(),
		addMusic: z.string().optional(),
		addCategory: z.array(z.string()).optional(),
		products: z.array(z.string()).optional(),
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
		addLocation: z.object({}).optional(),
		addMusic: z.string().optional(),
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

export type createPostInputs = z.infer<typeof createPostSchema>["body"];

export type getSinglePostInputs = z.infer<typeof getSinglePostSchema>["params"];

export type updatePostInputs = z.infer<typeof updatePostSchema>;

export type deletePostInputs = z.infer<typeof deletePostSchema>["params"];
