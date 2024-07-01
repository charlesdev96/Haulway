import { z } from "zod";

export const addItemToCartSchema = z.object({
	body: z.object({
		cart: z.string().optional(),
		store: z.string().optional(),
		product: z.string().optional(),
		post: z.string().optional(),
		influencer: z.string().nullable().optional(),
		quantity: z.number({ required_error: "please provide item quantity" }),
	}),
	params: z.object({
		productId: z.string({ required_error: "productId is required" }),
		postId: z.string({ required_error: "postId is required" }),
	}),
});

export const updateCartSchema = z.object({
	body: z.object({
		quantity: z.number().optional(),
	}),
	params: z.object({
		productId: z.string({ required_error: "product id required" }),
	}),
});

export const removeItemSchema = z.object({
	params: z.object({
		productId: z.string({ required_error: "product id required" }),
	}),
});

export type addItemToCartInputs = z.infer<typeof addItemToCartSchema>;

export type updateCartInputs = z.infer<typeof updateCartSchema>;

export type removeItemInputs = z.infer<typeof removeItemSchema>["params"];
