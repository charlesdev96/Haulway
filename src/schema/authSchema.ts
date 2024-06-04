import { z } from "zod";

export const registerUserSchema = z.object({
	body: z.object({
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
		otp: z.number().optional(),
		otpExpirationDate: z.date().nullable().optional(),
		role: z.enum(["user", "admin"]).optional(),
	}),
});

export const verifyUserSchema = z.object({
	body: z.object({
		otp: z.number({ required_error: "Please provide missing otp" }),
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
	body: z.object({
		email: z
			.string({
				required_error: "Email is required",
			})
			.email({ message: "Invalid email address" }),
	}),
});

export const verifyPasswordOtpSchema = z.object({
	body: z.object({
		otp: z.number({
			required_error: "Please provide otp and it must be 5 digits",
		}),
	}),
});

export const resetPasswordSchema = z.object({
	body: z.object({
		password: z
			.string({
				required_error: "Please provide a valid password",
			})
			.min(6),
	}),
});

export type registerUserInputs = z.infer<typeof registerUserSchema>["body"];

export type verifyUserInputs = z.infer<typeof verifyUserSchema>["body"];

export type loginInputs = z.infer<typeof loginSchema>["body"];

export type forgotPasswordInputs = z.infer<typeof forgotPasswordSchema>["body"];

export type verifyPasswordOtpInputs = z.infer<
	typeof verifyPasswordOtpSchema
>["body"];

export type resetPasswordInputs = z.infer<typeof resetPasswordSchema>["body"];
