import { z } from "zod";

export const getSingleUserSchema = z.object({
	params: z.object({
		id: z.string({
			required_error: "Please provide the id of the user",
		}),
	}),
});

export type getSingleUserInputs = z.infer<typeof getSingleUserSchema>["params"];
