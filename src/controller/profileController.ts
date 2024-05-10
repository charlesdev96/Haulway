import { Request, Response } from "express";
import {
	CustomRequest,
	findUserById,
	userProfile,
	validatePassword,
	userNameExist,
} from "../services";
import { updateProfileInputs } from "../schema";
import { StatusCodes } from "http-status-codes";
import { log } from "../utils";
import { UserDocument } from "../model";

export class profiles {
	public async userProfile(req: CustomRequest, res: Response) {
		try {
			const email = req.user?.email;
			if (!email) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await userProfile(email);
			res.status(StatusCodes.OK).json({
				success: true,
				message: "User profile retrieved successfully.",
				data: user,
			});
		} catch (error: any) {
			log.info(error);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: "Unable to display user profile",
				error: error,
			});
		}
	}

	public async updateProfile(req: CustomRequest, res: Response) {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const body = req.body as updateProfileInputs;
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found." });
			}
			const updateUser = user as UserDocument;
			//update properties individually
			if (body.fullName) {
				updateUser.fullName = body.fullName;
			}
			if (body.profilePic) {
				updateUser.profilePic = body.profilePic;
			}
			if (body.password && body.oldPassword) {
				//check if oldpassword matches current password
				const isPasswordCorrect = await validatePassword(
					body.password,
					body.oldPassword,
				);
				if (!isPasswordCorrect) {
					return res
						.status(StatusCodes.UNAUTHORIZED)
						.json({ error: "old password must match current password" });
				}
				updateUser.password = body.password;
			}
			if (body.userName) {
				//check if username exist
				await userNameExist(body.userName, res);
				updateUser.userName = body.userName;
			}
			//save the updated user
			await updateUser.save();
			res.status(StatusCodes.OK).json({
				success: true,
				message: "User account updated successfully",
			});
		} catch (error: any) {
			log.info(error);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				error: error,
				message: "Unable to update account.",
			});
		}
	}
}
