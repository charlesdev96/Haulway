import { z } from "zod";

export const followerUserSchema = z.object({
	params: z.object({
		targetUserId: z.string({
			required_error: "Please provide the id of the user you want to follow",
		}),
	}),
});

export type followerUserInputs = z.infer<typeof followerUserSchema>["params"];
