import { z } from "zod";

export const createPostSchema = z.object({
	body: z.object({
		content: z
			.array(z.string())
			.nonempty({ message: "Content Can't be empty!" }),
		desc: z.string().optional(),
		postedBy: z.string().optional(),
		followingStatus: z.enum(["following", "follow", "owner"]).optional(),
	}),
});

export const updatePostSchema = z.object({
	body: z.object({
		content: z.array(z.string()).optional(),
		desc: z.string().optional(),
	}),
	params: z.object({
		postId: z.string({
			required_error: "Product Id is required",
		}),
	}),
});

export type createPostInputs = z.infer<typeof createPostSchema>["body"];

export type updatePostInputs = z.infer<typeof updatePostSchema>;
