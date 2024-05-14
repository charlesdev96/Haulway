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

export const deleteAccountSchema = z.object({
	body: z.object({
		email: z
			.string({
				required_error: "Please provide an email",
			})
			.email({ message: "Please provide a valid email" }),
	}),
});

export type updateProfileInputs = z.infer<typeof updateProfileSchema>["body"];
export type deleteAccountInputs = z.infer<typeof deleteAccountSchema>["body"];
