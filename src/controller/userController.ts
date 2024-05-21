import { Response } from "express";
import {
	getAllUser,
	CustomRequest,
	findUserById,
	singleUser,
} from "../services";
import { getSingleUserInputs } from "../schema";
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
				const { followers, ...userDetails } = data._doc;
				return { status: status, ...userDetails };
			});
			res.status(StatusCodes.OK).json({
				success: true,
				message: "All users retrieved successfully.",
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
}
