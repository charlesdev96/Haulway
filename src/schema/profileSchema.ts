import { z } from "zod";

export const updateProfileSchema = z.object({
	body: z
		.object({
			fullName: z.string().optional(),
			userName: z.string().optional(),
			profilePic: z.string().optional(),
			role: z
				.enum(["admin", "influencer", "user", "vendor", "tutor"])
				.optional(),
			password: z.string().optional(),
			confirmPassword: z.string().optional(),
			oldPassword: z.string().optional(),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Passwords do not match",
			path: ["confirmPassword"],
		}),
});

export type updateProfileInputs = z.infer<typeof updateProfileSchema>["body"];
