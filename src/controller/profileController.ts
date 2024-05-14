import { Request, Response } from "express";
import {
	CustomRequest,
	findUserById,
	userProfile,
	validatePassword,
	userNameExist,
	existingUser,
} from "../services";
import { updateProfileInputs, deleteAccountInputs } from "../schema";
import { StatusCodes } from "http-status-codes";
import { log } from "../utils";
import { UserDocument, UserModel } from "../model";

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
				await updateUser.save();
				return res.status(StatusCodes.OK).json({
					success: true,
					message: `Profile information updated. Your full name is now ${body.fullName}`,
				});
			}
			if (body.role) {
				updateUser.role = body.role;
				await updateUser.save();
				return res.status(StatusCodes.OK).json({
					success: true,
					message: `Profile information updated. Your role is now ${body.role}`,
				});
			}
			if (body.profilePic) {
				updateUser.profilePic = body.profilePic;
				await updateUser.save();
				return res.status(StatusCodes.OK).json({
					success: true,
					message: `Profile picture have been updated successfully`,
				});
			}
			if (body.password && body.oldPassword) {
				const { password, ...userData } = updateUser as { password: string };
				//check if oldpassword matches current password
				const isPasswordCorrect: boolean = await validatePassword(
					body.oldPassword,
					password,
				);
				if (!isPasswordCorrect) {
					return res
						.status(StatusCodes.UNAUTHORIZED)
						.json({ message: "old password must match current password" });
				}
				updateUser.password = body.password;
				await updateUser.save();
				return res.status(StatusCodes.OK).json({
					success: true,
					message: "User password updated successfully",
				});
			}
			if (body.userName) {
				//check if username exist
				const existingUsername = await userNameExist(body.userName);
				if (existingUsername) {
					const message = `Oops! Username ${body.userName} already taken. Please choose a different one.`;
					log.info(message);
					return res
						.status(StatusCodes.BAD_REQUEST)
						.json({ success: false, message: message });
				} else {
					const message = `The chosen username ${body.userName} is available.`;
					log.info(message);
				}
				updateUser.userName = body.userName;
				await updateUser.save();
				return res.status(StatusCodes.OK).json({
					success: true,
					message: `The chosen username ${body.userName} is available and assigned to you.`,
				});
			}

			return res.status(StatusCodes.BAD_REQUEST).json({
				success: true,
				message: "User account was not updated",
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

	public async deleteAccount(
		req: Request<{}, {}, deleteAccountInputs>,
		res: Response,
	) {
		try {
			const { email } = req.body as deleteAccountInputs;
			const user = await existingUser(email);
			if (!user) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "User not found" });
			}
			await user.deleteOne();
			res
				.status(StatusCodes.OK)
				.json({ success: true, message: "User account successfully deleted" });
		} catch (error: any) {
			log.info(error.message);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Unable to delete account" });
		}
	}
}
