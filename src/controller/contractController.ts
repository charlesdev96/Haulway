import { Response } from "express";
import {
	createContract,
	CustomRequest,
	findUserById,
	findContractById,
	findContractors,
} from "../services";
import {
	createContractInputs,
	replyRequestInputs,
	createInfluencerContractInputs,
	influencerReplyRequestInputs,
} from "../schema";
import { log } from "../utils";
import { StatusCodes } from "http-status-codes";
import { addDays } from "date-fns";

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
					message: `An error occured while sending request to influencer ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message:
						"An unknown error occurred while sending contract to influencer",
				});
			}
		}
	}

	public async vendorReplyRequest(req: CustomRequest, res: Response) {
		try {
			const body = req.body as replyRequestInputs["body"];
			const { contractId } = req.params as replyRequestInputs["params"];
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
			//check if contract exist
			const contract = await findContractById(contractId);
			if (!contract || !contract.influencer) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "contract not found." });
			}
			//check if contract belongs to vendor
			if (contract.vendor?.toString() !== userId.toString()) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "You are not authorized to review this contract" });
			}
			//check if vendor have already rejected this course
			if (contract.actionType === "declined") {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "You have already declined this request" });
			}
			//check if vendor have already accepted the request
			if (contract.actionType === "accepted") {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "You have already accepted this request" });
			}
			const influencer = await findContractors(contract.influencer);
			if (!influencer) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Influencer not found." });
			}
			if (body.percentage) contract.percentage = body.percentage;
			if (body.actionType) contract.actionType = body.actionType;
			if (body.timeFrame) contract.timeFrame = body.timeFrame;
			if (body.actionType === "accepted") {
				const days = Number(contract.timeFrame);
				const contractExpirationDate: Date = addDays(new Date(), days);
				contract.completionDate = contractExpirationDate;
				contract.status = "active";
				await contract.save();
				//filter out the contract id from their request
				user.requests = user.requests?.filter(
					(request) => request.toString() !== contract._id.toString(),
				);
				user.contracts?.push(contractId);
				influencer.requests = influencer.requests?.filter(
					(request) => request.toString() !== contract._id.toString(),
				);
				influencer.contracts?.push(contractId);
				// Save user and influencer concurrently
				await Promise.all([user.save(), influencer.save()]);
				const updatedContract = await findContractById(contractId);
				return res.status(StatusCodes.OK).json({
					success: true,
					message: "You have successfully responded to this request",
					data: updatedContract,
				});
			} else {
				await contract.save();
				const updatedContract = await findContractById(contractId);
				return res.status(StatusCodes.OK).json({
					success: true,
					message: "You have successfully responded to this request",
					data: updatedContract,
				});
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `An error occured while replying request to influencer ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message:
						"An unknown error occurred while replying request to  influencer",
				});
			}
		}
	}

	public async influencerSendContractRequest(
		req: CustomRequest,
		res: Response,
	) {
		try {
			const body = req.body as createInfluencerContractInputs;
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
			//check if user is an influencer
			if (user.role !== "influencer") {
				return res
					.status(StatusCodes.FORBIDDEN)
					.json({ message: "only vendors are allowed to access this route" });
			}
			//send request to vendor
			body.influencer = userId;
			const vendor = await findUserById(body.vendor);
			if (!vendor) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Vendor not found" });
			}
			const request = await createContract(body);
			//send request to influencer and vendor
			vendor.requests?.push(request._id);
			await vendor.save();
			user.requests?.push(request._id);
			await user.save();
			res.status(StatusCodes.CREATED).json({
				success: true,
				message: `Request successfully sent to ${vendor.fullName}`,
				data: request,
			});
		} catch (error: unknown) {
			log.info(error);
			if (error instanceof Error) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `An error occured while sending request to vendor ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while sending contract to vendor",
				});
			}
		}
	}

	public async influencerReplyRequest(req: CustomRequest, res: Response) {
		try {
			const body = req.body as influencerReplyRequestInputs["body"];
			const { contractId } =
				req.params as influencerReplyRequestInputs["params"];
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
			//check if contract exist
			const contract = await findContractById(contractId);
			if (!contract || !contract.vendor) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "contract not found." });
			}
			//check if contract belongs to influencer
			if (contract.influencer?.toString() !== userId.toString()) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "You are not authorized to review this contract" });
			}
			//check if vendor have already rejected this course
			if (contract.actionType === "declined") {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "You have already declined this request" });
			}
			//check if influencer have already accepted the request
			if (contract.actionType === "accepted") {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "You have already accepted this request" });
			}
			const vendor = await findContractors(contract.vendor);
			if (!vendor) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: "Vendor not found." });
			}
			if (body.percentage) contract.percentage = body.percentage;
			if (body.actionType) contract.actionType = body.actionType;
			if (body.timeFrame) contract.timeFrame = body.timeFrame;
			if (body.actionType === "accepted") {
				const days = Number(contract.timeFrame);
				const contractExpirationDate: Date = addDays(new Date(), days);
				contract.completionDate = contractExpirationDate;
				contract.status = "active";
				await contract.save();
				//filter out the contract id from their request
				user.requests = user.requests?.filter(
					(request) => request.toString() !== contract._id.toString(),
				);
				user.contracts?.push(contractId);
				vendor.requests = vendor.requests?.filter(
					(request) => request.toString() !== contract._id.toString(),
				);
				vendor.contracts?.push(contractId);
				// Save user and vendor concurrently
				await Promise.all([user.save(), vendor.save()]);
				const updatedContract = await findContractById(contractId);
				return res.status(StatusCodes.OK).json({
					success: true,
					message: "You have successfully responded to this request",
					data: updatedContract,
				});
			} else {
				await contract.save();
				const updatedContract = await findContractById(contractId);
				return res.status(StatusCodes.OK).json({
					success: true,
					message: "You have successfully responded to this request",
					data: updatedContract,
				});
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: `An error occured while replying request to vendor ${error.message}`,
				});
			} else {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					success: false,
					message: "An unknown error occurred while replying request to vendor",
				});
			}
		}
	}
}
