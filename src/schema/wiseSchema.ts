import { z } from "zod";

export const createProfileSchema = z.object({
	body: z.object({
		firstName: z.string({ required_error: "firstName required" }),
		lastName: z.string({ required_error: "lastName is required" }),
		dateOfBirth: z.string({ required_error: "dateOfBirth is required" }),
		phoneNumber: z.string({ required_error: "phoneNumber is required" }),
		email: z.string({ required_error: "email is required" }),
		walletId: z.string().optional(),
		profileId: z.string().optional(),
	}),
});

export type createProfileInputs = z.infer<typeof createProfileSchema>["body"];
