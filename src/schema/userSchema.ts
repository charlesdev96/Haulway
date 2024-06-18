import { z } from "zod";

export const getSingleUserSchema = z.object({
	params: z.object({
		id: z.string({
			required_error: "Please provide the id of the user",
		}),
	}),
});

export const searchUserSchema = z.object({
	query: z.object({
		search: z.string({ required_error: "please provide a search criteria" }),
	}),
});

export type getSingleUserInputs = z.infer<typeof getSingleUserSchema>["params"];

export type searchUserInputs = z.infer<typeof searchUserSchema>["query"];
