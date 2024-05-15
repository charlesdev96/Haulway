import { z } from "zod";

export const createreplySchema = z.object({
	body: z.object({
		reply: z.string({ required_error: "Please leave a reply on the comment" }),
		comment: z.string().optional(),
		replier: z.string().optional(),
	}),
	params: z.object({
		commentId: z.string({
			required_error: "Please provide the id of the comment",
		}),
	}),
});

export type createreplyInputs = z.infer<typeof createreplySchema>;
