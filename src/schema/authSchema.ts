import { z } from "zod";

export const registerUserSchema = z.object({
	body: z
		.object({
			_id: z.string().optional(),
			fullName: z.string({
				required_error: "firstName is required",
			}),
			email: z
				.string({
					required_error: "Email is required",
				})
				.email({ message: "Invalid email address" }),
			password: z
				.string({
					required_error: "Password is required",
				})
				.min(6, { message: "Password too short - should be 6 chars minimum" }),
			confirmPassword: z.string({
				required_error: "confirmPassowrd is required",
			}),
			verificationCode: z.string().optional(),
			passwordResetCode: z.string().optional(),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Passwords do not match",
			path: ["confirmPassword"],
		}),
});

export type registerUserInputs = z.infer<typeof registerUserSchema>["body"];
