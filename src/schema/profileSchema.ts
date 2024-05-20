import { z } from "zod";

export const updateProfileSchema = z.object({
	body: z.object({
		fullName: z.string().optional(),
		userName: z.string().optional(),
		profilePic: z.string().url().optional(),
		password: z.string().min(6).optional(),
		oldPassword: z.string().optional(),
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

export const createStoreSchema = z
	.object({
		role: z.string().optional(),
		owner: z.string().optional(),
		storeName: z.string({
			required_error: "Please provide a name for your store",
		}),
		storeLogo: z.string().optional(),
		currency: z.string({
			required_error: "Please provide a currency for your store",
		}),
	})
	.refine(
		(data) => {
			if (data.role === "vendor" && !data.storeLogo) {
				return false;
			} else {
				return true;
			}
		},
		{
			message: "Please provide a logo for your store",
			path: ["storeLogo"],
		},
	);

export const upgradeAccountSchema = z.object({
	body: z.object({
		role: z.enum(["admin", "influencer", "user", "vendor", "tutor"], {
			message: "Please provide your role",
		}),
		store: createStoreSchema.optional(),
	}),
});

export type updateProfileInputs = z.infer<typeof updateProfileSchema>["body"];
export type deleteAccountInputs = z.infer<typeof deleteAccountSchema>["body"];
export type upgradeAccountInputs = z.infer<typeof upgradeAccountSchema>["body"];
