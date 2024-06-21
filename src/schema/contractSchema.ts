import { z } from "zod";

export const createContractSchema = z.object({
	body: z.object({
		percentage: z
			.number({
				required_error: "please provide the contract percentage",
			})
			.max(1, { message: "percentage cannot be more than 100%" }),
		timeFrame: z.string({
			required_error: "Please provide time frame of contract",
		}),
		vendor: z.string().optional(),
		influencer: z.string({ required_error: "please provide the influencer" }),
		products: z.array(z.string({ required_error: "please contract products" })),
	}),
});

export const createInfluencerContractSchema = z.object({
	body: z.object({
		percentage: z
			.number({
				required_error: "please provide the contract percentage",
			})
			.max(1, { message: "percentage cannot be more than 100%" }),
		timeFrame: z.string({
			required_error: "Please provide time frame of contract",
		}),
		influencer: z.string().optional(),
		vendor: z.string({ required_error: "please provide the vendor" }),
		products: z.array(z.string({ required_error: "please contract products" })),
	}),
});

export const replyRequestSchema = z.object({
	body: z.object({
		actionType: z.enum(["accepted", "negotiate", "declined", "pending"], {
			required_error: "please provide a reply",
		}),
		percentage: z
			.number()
			.max(1, { message: "percentage cannot be more than 100%" })
			.optional(),
		timeFrame: z.string().optional(),
		products: z.array(z.string()).optional(),
	}),
	params: z.object({
		contractId: z.string({ required_error: "please provide the request id" }),
	}),
});

export const influencerReplyRequestSchema = z.object({
	body: z.object({
		actionType: z.enum(["accepted", "negotiate", "declined", "pending"], {
			required_error: "please provide a reply",
		}),
		percentage: z
			.number()
			.max(1, { message: "percentage cannot be more than 100%" })
			.optional(),
		timeFrame: z.string().optional(),
		products: z.array(z.string()).optional(),
	}),
	params: z.object({
		contractId: z.string({ required_error: "please provide the request id" }),
	}),
});

export type createContractInputs = z.infer<typeof createContractSchema>["body"];

export type replyRequestInputs = z.infer<typeof replyRequestSchema>;

export type createInfluencerContractInputs = z.infer<
	typeof createInfluencerContractSchema
>["body"];

export type influencerReplyRequestInputs = z.infer<
	typeof influencerReplyRequestSchema
>;
