import { Response, Request } from "express";
import { CustomRequest } from "../services";
import {
	log,
	createStripeAccount,
	generateStripeAccountLink,
	deleteStripeAccount,
	generateStripeDashboardLink,
	checkAccountStatus,
} from "../utils";
import { onboardUserInputs } from "../schema";
import { findUserById } from "../services";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../model";

export class StripeController {
	public async stripeOnBoarding(req: CustomRequest, res: Response) {
		try {
			const body = req.body as onboardUserInputs;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			//find logged in user
			const user = await findUserById(userId);
			//check if user exist
			if (!user || !user.email) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			//check user already have a stripe id
			if (user.stripe_id) {
				const checkStatus = await checkAccountStatus(user.stripe_id);
				if (checkStatus) {
					const link = await generateStripeDashboardLink(user.stripe_id);
					user.stripe_url = link;
					await user.save();
					return res.status(StatusCodes.OK).json({
						message:
							"User already has a Stripe account and fully onboarded, visit your Stripe profile using the provided link",
						data: link,
					});
				}
				const link = await generateStripeAccountLink(user.stripe_id);

				return res.status(StatusCodes.OK).json({
					message:
						"User already have a stripe id, visit your stripe profile using the provided link and complete your registration",
					data: link,
				});
			}
			//generate stripe account for user
			const stripeAccount = await createStripeAccount(user.email, body.country);
			//return verification link if successful
			if (stripeAccount) {
				const link = await generateStripeAccountLink(stripeAccount.toString());
				user.stripe_url = link;
				user.stripe_id = stripeAccount.toString();
				await user.save();
				return res.status(StatusCodes.OK).json({
					success: true,
					message: "Stripe account successfully generated",
					data: link,
				});
			} else {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Unable to complete conboarding" });
			}
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to onboard user to stripe due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while onboarding user to stripe",
				});
			}
		}
	}

	public async deleteStripeAccount(req: Request, res: Response) {
		try {
			const { stripeId } = req.params;
			const user = await UserModel.findOne({ stripe_id: stripeId });
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			//proceed to delete stripe account
			await deleteStripeAccount(stripeId.toString());
			user.stripe_id = null;
			user.stripe_url = null;
			await user.save();
			res
				.status(StatusCodes.OK)
				.json({ message: "stripe account deleted successfully" });
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to delete stripe account due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while deleting stripe account",
				});
			}
		}
	}

	public async checkOnboardingStatus(req: Request, res: Response) {
		try {
			const { stripeId } = req.params;
			const user = await UserModel.findOne({ stripe_id: stripeId });
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			const status = await checkAccountStatus(stripeId);
			res.status(StatusCodes.OK).json({ data: status });
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to check stripe account status due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message:
						"An unknown error occurred while checking stripe account status",
				});
			}
		}
	}
}
