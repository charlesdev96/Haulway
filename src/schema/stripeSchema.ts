import { z } from "zod";

export const onboardUserSchema = z.object({
	body: z.object({
		country: z.string({
			required_error: "please provide country of residence",
		}),
	}),
});

export type onboardUserInputs = z.infer<typeof onboardUserSchema>["body"];
