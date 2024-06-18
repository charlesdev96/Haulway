import { Response } from "express";
import {
	getAllUser,
	CustomRequest,
	findUserById,
	singleUser,
	getAllUsersByRole,
	searchForUsers,
	searchUsersByRole,
} from "../services";
import { getSingleUserInputs, searchUserInputs } from "../schema";
import { UserData } from "../types";
import { StatusCodes } from "http-status-codes";
import { log } from "../utils";

export class UserController {
	public async getAllUsers(req: CustomRequest, res: Response) {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found." });
			}
			const users = await getAllUser(userId.toString());
			res.status(StatusCodes.OK).json({
				success: true,
				message: "All users retrieved successfully.",
				data: users,
			});
		} catch (error: any) {
			log.info(error);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: "Unable to display all users",
				error: error,
			});
		}
	}

	public async getSingleUser(req: CustomRequest, res: Response) {
		try {
			const { id } = req.params as getSingleUserInputs;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found." });
			}
			const singleUserData = await singleUser(id);
			if (!singleUserData) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found." });
			}
			//data returned should depend on the role of the user
			const updatedData = [singleUserData];
			const outputData: UserData[] = (updatedData || []).map((data: any) => {
				let status: "follow" | "following" = "follow";
				// Check if userId is in the followers array
				if (data.followers?.includes(userId.toString())) {
					status = "following";
				}
				// Remove the followers field from postedBy
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { followers, ...userDetails } = data._doc;
				return { status: status, ...userDetails };
			});
			res.status(StatusCodes.OK).json({
				success: true,
				message: "User retrieved successfully.",
				data: outputData,
			});
		} catch (error: any) {
			log.info(error);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: `Unable to display all user info due to: ${error.mesage}`,
			});
		}
	}

	public async getAllVendors(req: CustomRequest, res: Response) {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found." });
			}
			const vendors = await getAllUsersByRole("vendor", userId);
			res
				.status(StatusCodes.OK)
				.json({ success: true, message: "List of all vendors", data: vendors });
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `An error occured while getting all vendors due to ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while getting all vendors",
				});
			}
		}
	}

	public async getAllInfluencers(req: CustomRequest, res: Response) {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found." });
			}
			const influencers = await getAllUsersByRole("influencer", userId);
			res.status(StatusCodes.OK).json({
				success: true,
				message: "List of all influencers",
				data: influencers,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `An error occured while getting all influencers due to ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while getting all influencers",
				});
			}
		}
	}

	public async searchUsers(req: CustomRequest, res: Response) {
		try {
			const { search } = req.query as searchUserInputs;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found." });
			}
			const users = await searchForUsers(search, userId);
			//if nothing is found return empty array
			if (
				!users ||
				users.length === 0 ||
				search === null ||
				search === undefined ||
				search === ""
			) {
				return res
					.status(StatusCodes.OK)
					.json({ success: true, message: "No user found", data: [] });
			}
			res.status(StatusCodes.OK).json({
				success: true,
				message: "List of searched users",
				data: users,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `An error occured while searching for users ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while getting searched users",
				});
			}
		}
	}

	public async searchForVendors(req: CustomRequest, res: Response) {
		try {
			const { search } = req.query as searchUserInputs;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found." });
			}
			const vendors = await searchUsersByRole(search, "vendor", userId);
			//if nothing is found return empty array
			if (
				!vendors ||
				vendors.length === 0 ||
				search === null ||
				search === undefined ||
				search === ""
			) {
				return res
					.status(StatusCodes.OK)
					.json({ success: true, message: "No vendor found", data: [] });
			}

			res.status(StatusCodes.OK).json({
				success: true,
				message: "List of searched vendors",
				data: vendors,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `An error occured while searching for vendors ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while getting searched vendors",
				});
			}
		}
	}

	public async searchForInfluencers(req: CustomRequest, res: Response) {
		try {
			const { search } = req.query as searchUserInputs;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found." });
			}
			const influencers = await searchUsersByRole(search, "influencer", userId);
			//if nothing is found return empty array
			if (
				!influencers ||
				influencers.length === 0 ||
				search === null ||
				search === undefined ||
				search === ""
			) {
				return res
					.status(StatusCodes.OK)
					.json({ success: true, message: "No influencer found", data: [] });
			}

			res.status(StatusCodes.OK).json({
				success: true,
				message: "List of searched influencer",
				data: influencers,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `An error occured while searching for influencer ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message:
						"An unknown error occurred while getting searched influencer",
				});
			}
		}
	}
}
