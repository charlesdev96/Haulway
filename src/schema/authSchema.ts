import { query } from "express";
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

export const verifyUserSchema = z.object({
	params: z.object({
		id: z.string(),
		verificationCode: z.string(),
	}),
});

export const loginSchema = z.object({
	body: z.object({
		email: z
			.string({
				required_error: "Email is required",
			})
			.email({ message: "Invalid email address" }),
		password: z
			.string({
				required_error: "Password is required",
			})
			.min(6, "Invalid email or password"),
	}),
});

export const forgotPasswordSchema = z.object({
	body: z
		.object({
			email: z
				.string({
					required_error: "Email is required",
				})
				.email({ message: "Invalid email address" }),
			password: z
				.string({
					required_error: "Password is required",
				})
				.min(6, "Invalid email or password"),
			confirmPassword: z.string({
				required_error: "confirmPassowrd is required",
			}),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Passwords do not match",
			path: ["confirmPassword"],
		}),
});

export const verifyresetPasswordSchema = z.object({
	query: z.object({
		id: z.string(),
		passwordCode: z.string(),
		password: z.string(),
		email: z.string(),
	}),
});

export type registerUserInputs = z.infer<typeof registerUserSchema>["body"];

export type verifyUserInputs = z.infer<typeof verifyUserSchema>["params"];

export type loginInputs = z.infer<typeof loginSchema>["body"];

export type forgotPasswordInputs = z.infer<typeof forgotPasswordSchema>["body"];

export type resetPasswordInputs = z.infer<
	typeof verifyresetPasswordSchema
>["query"];
