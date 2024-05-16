import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomRequest, findUserById } from "../services";
import { followerUserInputs } from "../schema";
import { log } from "../utils";
import { AnyArray } from "mongoose";

export class UserActivitiesController {
	public async followUser(req: CustomRequest, res: Response) {
		try {
			const { targetUserId } = req.params as followerUserInputs;
			const userId = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const currentUser = await findUserById(userId);
			if (!currentUser) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "User not found." });
			}
			const targetUser = await findUserById(targetUserId);
			if (!targetUser) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "target user not found." });
			}
			const targetUserFullName = targetUser.fullName;
			// Check if targetUserId already exists in currentUser's followings array
			const alreadyFollowing = currentUser.followings?.includes(
				targetUserId.toString(),
			);
			if (alreadyFollowing) {
				//remove targetUserId from the currentUser followings
				currentUser.followings = currentUser.followings?.filter(
					(following) => following.toString() !== targetUserId.toString(),
				);
				currentUser.numOfFollowings = currentUser.followings?.length;
				await currentUser.save();
				//remove currentUser from the target user followers
				targetUser.followers = targetUser.followers?.filter(
					(follower) => follower.toString() !== userId.toString(),
				);
				targetUser.numOfFollowers = targetUser.followers?.length;
				await targetUser.save();
				return res.status(StatusCodes.OK).json({
					success: true,
					message: `Congratulations!!!, you have successfully unfollowed ${targetUserFullName}`,
				});
			} else {
				//if not follower user
				currentUser.followings?.push(targetUserId);
				currentUser.numOfFollowings = currentUser.followings?.length;
				await currentUser.save();
				targetUser.followers?.push(userId);
				targetUser.numOfFollowers = targetUser.followers?.length;
				await targetUser.save();
				return res.status(StatusCodes.OK).json({
					success: true,
					message: `Congratulations!!!, you are now following ${targetUserFullName}`,
				});
			}
		} catch (error: any) {
			log.info(error);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: `Unable to follow user. error: ${error.message}`,
			});
		}
	}
}
