import { Response } from "express";
import { getAllUser, CustomRequest, findUserById } from "../services";
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
			const users = await getAllUser();
			res.status(StatusCodes.OK).json({
				success: true,
				message: "All users retrieved successfully.",
				data: users,
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
}
