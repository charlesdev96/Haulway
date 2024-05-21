import { Request, Response } from "express";
import {
	CustomRequest,
	findUserById,
	userData,
	validatePassword,
	userNameExist,
	existingUser,
	createStore,
	findStoreByName,
} from "../services";
import {
	updateProfileInputs,
	deleteAccountInputs,
	upgradeAccountInputs,
} from "../schema";
import { StatusCodes } from "http-status-codes";
import { log } from "../utils";
import { UserDocument, UserModel } from "../model";

export class profiles {
	public async userProfile(req: CustomRequest, res: Response) {
		try {
			const userId = req.user?.userId;
			const role = req.user?.role;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			if (!role) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await userData(role.toString(), userId.toString());
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
			if (body.profilePic) {
				updateUser.profilePic = body.profilePic;
				await updateUser.save();
				return res.status(StatusCodes.OK).json({
					success: true,
					message: `Profile picture have been updated successfully`,
				});
			}
			if (body.password && body.oldPassword) {
				const { password } = updateUser as { password: string };
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
				body.userName = `@${body.userName}`;
				const existingUsername = await userNameExist(body.userName);
				//check if username belong to user
				if (
					existingUsername?.userName?.toString() === body.userName.toString()
				) {
					return res
						.status(StatusCodes.BAD_REQUEST)
						.json({ message: `${body.userName} is already assigned to you` });
				}
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

	public async upgradeAccount(req: CustomRequest, res: Response) {
		try {
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const body = req.body as upgradeAccountInputs;
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found." });
			}

			const updateUser = user as UserDocument;
			//check if user has already upgraded
			if (updateUser.role !== "user") {
				return res.status(StatusCodes.FORBIDDEN).json({
					message: `You have already changed your role once to ${updateUser.role}. Further changes are not permitted.`,
				});
			}
			if (body.role === "vendor" || body.role === "influencer") {
				//create a store for vendor
				if (!body.store) {
					return res
						.status(StatusCodes.BAD_REQUEST)
						.json({ message: "Please fill up store properties" });
				} else {
					//store name must be unique
					const storeNameExist = await findStoreByName(
						body.store.storeName.toString().toUpperCase(),
					);
					if (storeNameExist) {
						return res.status(StatusCodes.BAD_REQUEST).json({
							mesage: `Store name ${body.store.storeName} already exist, please choose another name`,
						});
					}
					//if store name does not exist, proceed to create store
					body.store.owner = userId.toString();
					body.store.role = body.role;
					const newStore = await createStore(body.store);
					updateUser.store = newStore._id;
					//update user account
					updateUser.role = body.role;
					await updateUser.save();
					res.status(StatusCodes.OK).json({
						success: true,
						message: `Congratulations, Your account has been successfully upgraded to ${body.role}!!!`,
					});
				}
			} else {
				//update user account
				updateUser.role = body.role;
				await updateUser.save();
				res.status(StatusCodes.OK).json({
					success: true,
					message: `Congratulations, Your account has been successfully upgraded to ${body.role}!!!`,
				});
			}
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
