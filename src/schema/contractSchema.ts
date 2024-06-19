import { z } from "zod";

export const createContractSchema = z.object({
	body: z.object({
		percentage: z.number({
			required_error: "please provide the contract percentage",
		}),
		timeFrame: z.string({
			required_error: "Please provide time frame of contract",
		}),
		vendor: z.string().optional(),
		influencer: z.string().optional(),
		products: z.array(z.string({ required_error: "please contract products" })),
	}),
});

export type createContractInputs = z.infer<typeof createContractSchema>["body"];
