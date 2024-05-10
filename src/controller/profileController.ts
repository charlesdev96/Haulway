import { Request, Response } from "express";
import { CustomRequest, findUserById, userProfile } from "../services";
import { StatusCodes } from "http-status-codes";
import { log } from "../utils";

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
			res
				.status(StatusCodes.OK)
				.json({
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
}
