import { z } from "zod";

const validSizes = ["xs", "s", "m", "l", "xl", "xxl"] as const;

const prodVarSchema = z.object({
	variantColour: z.array(z.string()).optional(),
	variantQuantity: z.number().optional(),
	variantSize: z.array(z.enum(validSizes)).optional(),
});

const generalInformationSchema = z.object({
	name: z.string({ required_error: "product name is required" }),
	brand: z.string({ required_error: "product brand is required" }),
	colour: z.array(z.string({ required_error: "product colour is required" })),
	desc: z
		.string({ required_error: "product desc is required" })
		.min(3)
		.max(500),
	category: z.string({ required_error: "product category is required" }),
	size: z.array(z.enum(validSizes), {
		required_error: "product size is required",
	}),
	gender: z.enum(["male", "female", "unisex"]),
	productVar: prodVarSchema,
});

const priceSchema = z.object({
	basePrice: z.number({ required_error: "base price is required" }),
	discount: z.number().optional(),
	discountPrice: z.number().optional(),
	discountType: z.string().optional(),
	price: z.number().optional(),
});

const shippingSchema = z.object({
	shippingOptions: z.enum(["dhl", "fedx", "ups"]),
	refundPolicy: z.string().optional(),
});

const inventorySchema = z.object({
	quantity: z.number({ required_error: "product quantity is required" }),
	stockStatus: z.string({ required_error: "stock status is required" }),
	productTags: z.array(z.string()).optional(),
});

const productSchema = z.object({
	products: z.array(z.string({ required_error: "product " })),
});

export const vendorProductSchema = z.object({
	body: z.object({
		genInfo: generalInformationSchema,
		productPrice: priceSchema,
		shippingAndDelivery: shippingSchema,
		inventory: inventorySchema,
		productReview: productSchema,
		vendor: z.string().optional(),
		status: z.enum(["published", "unpublished"]).optional(),
	}),
});

export const updateVendorProductSchema = z.object({
	body: z.object({
		genInfo: z
			.object({
				name: z.string().optional(),
				brand: z.string().optional(),
				colour: z.array(z.string()).optional(),
				desc: z.string().min(3).max(500).optional(),
				category: z.string().optional(),
				size: z.array(z.enum(validSizes)).optional(),
				gender: z.enum(["male", "female", "unisex"]).optional(),
				productVar: prodVarSchema.optional(),
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
		shippingAndDelivery: z
			.object({
				shippingOptions: z.enum(["dhl", "fedx", "ups"]).optional(),
				refundPolicy: z.string().optional(),
			})
			.optional(),
		inventory: z
			.object({
				quantity: z.number().optional(),
				stockStatus: z.string().optional(),
				productTags: z.array(z.string()).optional(),
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

export type vendorProductInputs = z.infer<typeof vendorProductSchema>["body"];

export type updateVendorProductInputs = z.infer<
	typeof updateVendorProductSchema
>;
