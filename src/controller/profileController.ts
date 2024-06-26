import { Request, Response } from "express";
import {
	CustomRequest,
	findUserById,
	validatePassword,
	userNameExist,
	existingUser,
	createStore,
	createInfluencerStore,
	findStoreByName,
	findInfluencerStoreByName,
	findStoreByUserId,
	findInfluencerStoreByUserId,
	getVendorProfile,
	getUserProfile,
	getVendorStore,
	getInfluencerProfile,
	getInfluencerStore,
	getAllPostTaged,
} from "../services";
import {
	updateProfileInputs,
	deleteAccountInputs,
	upgradeAccountInputs,
	updateStoreInputs,
} from "../schema";
import { StatusCodes } from "http-status-codes";
import { log } from "../utils";
import {
	UserDocument,
	StoreModel,
	PostModel,
	VendorProductModel,
	InfluencerStoreModel,
	InfluencerProductModel,
	CommentModel,
	ProductReviewModel,
	ReplyModel,
} from "../model";

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
			const user = await getUserProfile(userId);
			const postTaged = await getAllPostTaged(userId);
			const output: object = { ...user?.toObject(), postTaged };
			res.status(StatusCodes.OK).json({
				success: true,
				message: "User profile retrieved successfully.",
				data: output,
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
			const body = req.body as upgradeAccountInputs;
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

			const updateUser = user as UserDocument;
			//check if user has already upgraded
			if (updateUser.role !== "user") {
				return res.status(StatusCodes.FORBIDDEN).json({
					message: `You have already changed your role once to ${updateUser.role}. Further changes are not permitted.`,
				});
			}
			if (body.role === "vendor") {
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
			} else if (body.role === "influencer") {
				//create a store for vendor
				if (!body.store) {
					return res
						.status(StatusCodes.BAD_REQUEST)
						.json({ message: "Please fill up store properties" });
				} else {
					//store name must be unique
					const storeNameExist = await findInfluencerStoreByName(
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
					const newStore = await createInfluencerStore(body.store);
					updateUser.influencerStore = newStore._id;
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
			if (error.code === 11000) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "store name already exist",
				});
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An error occured while trying to update account",
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					error: error,
					message: "Unable to update account.",
				});
			}
		}
	}

	public async updateStore(req: CustomRequest, res: Response) {
		try {
			const body = req.body as updateStoreInputs;
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
			//find user store
			if (user.role === "vendor") {
				const store = await findStoreByUserId(userId);
				if (!store) {
					return res
						.status(StatusCodes.NOT_FOUND)
						.json({ message: "Store not found" });
				}

				//if store exist update the store
				if (body.storeDesc) store.storeDesc = body.storeDesc;
				if (body.storeLogo) store.storeLogo = body.storeLogo;
				if (body.storeName) store.storeName = body.storeName;
				//save the newly updated store
				await store.save();
				res.status(StatusCodes.OK).json({
					success: true,
					message: "Congratulations, the store has been successfully updated.",
				});
			} else {
				const store = await findInfluencerStoreByUserId(userId);
				if (!store) {
					return res
						.status(StatusCodes.NOT_FOUND)
						.json({ message: "Store not found" });
				}

				//if store exist update the store
				if (body.storeDesc) store.storeDesc = body.storeDesc;
				if (body.storeLogo) store.storeLogo = body.storeLogo;
				if (body.storeName) store.storeName = body.storeName;
				//save the newly updated store
				await store.save();
				res.status(StatusCodes.OK).json({
					success: true,
					message: "Congratulations, the store has been successfully updated.",
				});
			}
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
					return res
						.status(StatusCodes.INTERNAL_SERVER_ERROR)
						.json({ message: "Wrong Id format" });
				}
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to update store due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while updating store",
				});
			}
		}
	}

	public async deleteAccount(
		req: Request<object, object, deleteAccountInputs>,
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
			const userId: string = user._id;
			//delete user posts
			await PostModel.deleteMany({ postedBy: userId.toString() });
			//delete all user comments
			await CommentModel.deleteMany({ commentedBy: userId.toString() });
			//delete product reviews
			await ProductReviewModel.deleteMany({ reviewer: userId.toString() });
			//delete users reply
			await ReplyModel.deleteMany({ replier: userId.toString() });
			if (user.role === "user") {
				await user.deleteOne();
				return res.status(StatusCodes.OK).json({
					success: true,
					message: "User account successfully deleted",
				});
			} else if (user.role === "vendor") {
				await StoreModel.deleteMany({ owner: userId.toString() });
				await VendorProductModel.deleteMany({ vendor: userId.toString() });
				await user.deleteOne();
				return res.status(StatusCodes.OK).json({
					success: true,
					message: "User account successfully deleted",
				});
			} else if (user.role === "influencer") {
				await InfluencerStoreModel.deleteMany({ owner: userId.toString() });
				await InfluencerProductModel.deleteMany({
					influencer: userId.toString(),
				});
				await user.deleteOne();
				return res.status(StatusCodes.OK).json({
					success: true,
					message: "User account successfully deleted",
				});
			} else {
				await user.deleteOne();
				return res.status(StatusCodes.OK).json({
					success: true,
					message: "User account successfully deleted",
				});
			}
		} catch (error: any) {
			log.info(error.message);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Unable to delete account" });
		}
	}

	public async vendorProfile(req: CustomRequest, res: Response) {
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
			const profile = await getVendorProfile(userId);
			res
				.status(StatusCodes.OK)
				.json({ success: true, message: "Vendor profile", data: profile });
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `Unable to update store due to: ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while updating store",
				});
			}
		}
	}

	public async vendorStore(req: CustomRequest, res: Response) {
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
			if (!user.store) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "You are not allowed to access this route" });
			}
			const userStore = await getVendorStore(user.store);
			if (!userStore) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Store not found" });
			}

			const {
				productSales,
				totalOrders,
				totalOrdersDelivered,
				numOfPendingOrders,
				totalSales,
				totalOrderAmount,
				...remainingData
			} = userStore.toObject();

			const stats: object = {
				productSales,
				totalOrders,
				totalOrdersDelivered,
				numOfPendingOrders,
			};

			const overview: object = {
				totalSales,
				totalOrderAmount,
			};

			const vendorStore: object = {
				stats,
				overview,
				...remainingData,
			};

			res.status(StatusCodes.OK).json({
				success: true,
				message: "Vendor store successfully retrieved",
				data: vendorStore,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An error occured while trying to get vendor store",
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					error: error,
					message: "Unable to get vendor store.",
				});
			}
		}
	}

	public async influencerProfile(req: CustomRequest, res: Response) {
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

			if (user.role !== "influencer") {
				return res.status(StatusCodes.FORBIDDEN).json({
					message: "Only influencers are allowed to access this route",
				});
			}

			const profile = await getInfluencerProfile(userId);
			res
				.status(StatusCodes.OK)
				.json({ success: true, message: "Influencer profile", data: profile });
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An error occured while trying to get influencer profile",
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					error: error,
					message: "Unable to get influencer profile.",
				});
			}
		}
	}

	public async influencerStore(req: CustomRequest, res: Response) {
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

			if (!user.influencerStore) {
				return res.status(StatusCodes.FORBIDDEN).json({
					message: "Only influencers are allowed to access this route",
				});
			}
			const store = await getInfluencerStore(user.influencerStore);
			if (!store) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Store not found" });
			}

			store.accountEngaged = user.contracts?.length;
			store.accountReached =
				(user.contracts?.length || 0) + (user.requests?.length || 0);
			await store.save();

			const { accountReached, accountEngaged, ...remainingData } =
				store.toObject();
			const stats: object = {
				accountReached,
				accountEngaged,
				totalFollowers: user.numOfFollowers,
			};
			const influencerStore: object = {
				stats,
				...remainingData,
			};

			res.status(StatusCodes.OK).json({
				success: true,
				message: "Influencer store successfully retrieved",
				data: influencerStore,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An error occured while trying to get influencer store",
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					error: error,
					message: "Unable to get influencer store.",
				});
			}
		}
	}
}
