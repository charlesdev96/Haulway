import { Response } from "express";
import { createContract, CustomRequest, findUserById } from "../services";
import { createContractInputs } from "../schema";
import { log } from "../utils";
import { StatusCodes } from "http-status-codes";

export class ContractController {
	public async vendorSendContractRequest(req: CustomRequest, res: Response) {
		try {
			const body = req.body as createContractInputs;
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
			//check if user is a vendor
			if (user.role !== "vendor") {
				return res
					.status(StatusCodes.FORBIDDEN)
					.json({ message: "only vendors are allowed to access this route" });
			}
			//send request to influencer
			body.vendor = userId;
			const influencer = await findUserById(body.influencer);
			if (!influencer) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Influencer not found" });
			}
			const request = await createContract(body);
			//send request to influencer and vendor
			influencer.requests?.push(request._id);
			await influencer.save();
			user.requests?.push(request._id);
			await user.save();
			res.status(StatusCodes.CREATED).json({
				success: true,
				message: `Request successfully sent to ${influencer.fullName}`,
				data: request,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `An error occured while sending request to vendor or influencer ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message:
						"An unknown error occurred while sending contract to vendor or influencer",
				});
			}
		}
	}
}
