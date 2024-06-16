import { z } from "zod";

export const reviewProductSchema = z.object({
	body: z.object({
		comment: z.string().optional(),
		rating: z.number().min(1).max(5).optional(),
		reviewer: z.string().optional(),
		product: z.string().optional(),
	}),
	params: z.object({
		productId: z.string({ required_error: "product id is required" }),
	}),
});

export type reviewProductInputs = z.infer<typeof reviewProductSchema>;
