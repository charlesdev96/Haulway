import { Response } from "express";
import {
	createProfile,
	createWallet,
	getAccessToken,
	CustomRequest,
	findUserById,
	findStoreByUserId,
	findInfluencerStoreByUserId,
} from "../services";
import { createProfileInputs } from "../schema";
import { StatusCodes } from "http-status-codes";
import { log } from "../utils";

export class WiseController {
	public async createUserProfile(req: CustomRequest, res: Response) {
		try {
			const body = req.body as createProfileInputs;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			//find logged in user
			const user = await findUserById(userId);
			//check if user exist
			if (!user || !user.role || !user.email) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found" });
			}
			if (user.role !== "influencer" && user.role !== "vendor") {
				return res.status(StatusCodes.FORBIDDEN).json({
					message:
						"only vendors and influencers are allowed to access this route",
				});
			}
			//check if user have an existing profileId
			if (body.profileId && body.walletId) {
				if (user.role === "influencer") {
					const influencerStore = await findInfluencerStoreByUserId(userId);
					if (!influencerStore) {
						return res
							.status(StatusCodes.NOT_FOUND)
							.json({ message: "influencer store not found" });
					}
					influencerStore.profileId = body.profileId;
					influencerStore.walletId = body.walletId;
					await influencerStore.save();
					return res.status(StatusCodes.CREATED).json({
						success: true,
						message: "Wise profile successfully created",
					});
				} else {
					const store = await findStoreByUserId(userId);
					if (!store) {
						return res
							.status(StatusCodes.NOT_FOUND)
							.json({ message: "vendor store not found" });
					}
					store.profileId = body.profileId;
					store.walletId = body.walletId;
					await store.save();
					return res.status(StatusCodes.CREATED).json({
						success: true,
						message: "Wise profile successfully created",
					});
				}
			}
			const accessToken: string = await getAccessToken();
			const profileId: string = await createProfile(accessToken, body);
			if (!profileId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Unable to create profile id" });
			}
			const walletId: string = await createWallet(accessToken, profileId);
			if (!walletId) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Unable to create wallet id" });
			}
			const output = { profileId: profileId, walletId: walletId };
			if (user.role === "influencer") {
				const influencerStore = await findInfluencerStoreByUserId(userId);
				if (!influencerStore) {
					return res
						.status(StatusCodes.NOT_FOUND)
						.json({ message: "influencer store not found" });
				}
				influencerStore.profileId = profileId;
				influencerStore.walletId = walletId;
				await influencerStore.save();
				log.info(output);
				return res.status(StatusCodes.CREATED).json({
					success: true,
					message: "Wise profile successfully created",
				});
			} else {
				const store = await findStoreByUserId(userId);
				if (!store) {
					return res
						.status(StatusCodes.NOT_FOUND)
						.json({ message: "vendor store not found" });
				}
				store.profileId = profileId;
				store.walletId = walletId;
				await store.save();
				log.info(output);
				return res.status(StatusCodes.CREATED).json({
					success: true,
					message: "Wise profile successfully created",
				});
			}
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to get all vendor product due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while getting vendor product",
				});
			}
		}
	}
}
