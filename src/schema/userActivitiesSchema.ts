import { z } from "zod";

export const followerUserSchema = z.object({
	params: z.object({
		targetUserId: z.string({
			required_error: "Please provide the id of the user you want to follow",
		}),
	}),
});

export const likePostSchema = z.object({
	params: z.object({
		postId: z.string({
			required_error: "Please provide the id of the post you want to like",
		}),
	}),
});

export type followerUserInputs = z.infer<typeof followerUserSchema>["params"];

export type likePostInputs = z.infer<typeof likePostSchema>["params"];
