import { z } from "zod";

export const createPostSchema = z.object({
	body: z.object({
		content: z
			.array(z.string())
			.nonempty({ message: "Content Can't be empty!" }),
		desc: z.string().optional(),
		postedBy: z.string().optional(),
	}),
});

export type createPostInputs = z.infer<typeof createPostSchema>["body"];
