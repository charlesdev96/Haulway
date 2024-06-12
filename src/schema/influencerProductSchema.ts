import { z } from "zod";

const generalInformationSchema = z.object({
	videoName: z.string({ required_error: "video name is required" }),
	videoType: z.string({ required_error: "video type is required" }),
	videoDesc: z
		.string({ required_error: "video desc is required" })
		.min(3)
		.max(500),
	videoCategory: z.string({ required_error: "video name is required" }),
});

const priceSchema = z.object({
	basePrice: z.number({ required_error: "base price is required" }),
	discount: z.number().optional(),
	discountPrice: z.number().optional(),
	discountType: z.string().optional(),
	price: z.number().optional(),
});

const productSchema = z.object({
	products: z.array(z.string({ required_error: "product " })),
});

export const influencerProductSchema = z.object({
	body: z.object({
		genInfo: generalInformationSchema,
		productPrice: priceSchema,
		productReview: productSchema,
		store: z.string().optional(),
		influencer: z.string().optional(),
		status: z.enum(["published", "unpublished"]).optional(),
	}),
});

export const updateInfluencerProductSchema = z.object({
	body: z.object({
		genInfo: z
			.object({
				videoName: z.string().optional(),
				videoType: z.string().optional(),
				videoDesc: z.string().min(3).max(500).optional(),
				videoCategory: z.string().optional(),
			})
			.optional(),
		productPrice: z
			.object({
				basePrice: z.number().optional(),
				discount: z.number().optional(),
				discountPrice: z.number().optional(),
				discountType: z.string().optional(),
				price: z.number().optional(),
			})
			.optional(),
		productReview: z
			.object({
				products: z.array(z.string()).optional(),
			})
			.optional(),
	}),
	params: z.object({
		productId: z.string({ required_error: "product id is required" }),
	}),
});

export type influencerProductInputs = z.infer<
	typeof influencerProductSchema
>["body"];

export type updateInfluencerProductInputs = z.infer<
	typeof updateInfluencerProductSchema
>;
