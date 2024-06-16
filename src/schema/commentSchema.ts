import { z } from "zod";

export const createCommentSchema = z.object({
	body: z.object({
		comment: z.string({ required_error: "Please leave a comment" }),
		commentedBy: z.string().optional(),
		post: z.string().optional(),
	}),
	params: z.object({
		postId: z.string({
			required_error: "Please provide the id of the post",
		}),
	}),
});

export const updateCommentSchema = z.object({
	body: z.object({
		comment: z.string().min(1).optional(),
	}),
	params: z.object({
		commentId: z.string({
			required_error: "Please provide the Id of the comment",
		}),
	}),
});

export const deletecommentSchema = z.object({
	params: z.object({
		commentId: z.string({
			required_error: "Please provide id of the comment to be deleted",
		}),
	}),
});

export const getPostReviewSchema = z.object({
	params: z.object({
		postId: z.string({ required_error: "post id required" }),
	}),
});

export type createCommentInputs = z.infer<typeof createCommentSchema>;

export type updateCommentInputs = z.infer<typeof updateCommentSchema>;

export type deletecommentInputs = z.infer<typeof deletecommentSchema>["params"];

export type getPostReviewInputs = z.infer<typeof getPostReviewSchema>["params"];
