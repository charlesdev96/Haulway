import { Router } from "express";
import { ContractController } from "../controller/contractController";
import { authorizeUser, validateInputs } from "../middleware";
import {
	createContractSchema,
	replyRequestSchema,
	createInfluencerContractSchema,
	influencerReplyRequestSchema,
} from "../schema";

export class ContractRouter {
	private router: Router;
	private contractController: ContractController;
	constructor() {
		this.router = Router();
		this.contractController = new ContractController();
		this.initializeRouter();
	}

	private initializeRouter() {
		//vendor send influencer request
		this.router.post(
			"/vendor-send-request",
			authorizeUser,
			validateInputs(createContractSchema),
			this.contractController.vendorSendContractRequest.bind(
				this.contractController,
			),
		);
		//influencer send vendor request
		this.router.post(
			"/influencer-send-request",
			authorizeUser,
			validateInputs(createInfluencerContractSchema),
			this.contractController.influencerSendContractRequest.bind(
				this.contractController,
			),
		);
		//vendor reply request
		this.router.patch(
			"/vendor-reply-request/:contractId",
			authorizeUser,
			validateInputs(replyRequestSchema),
			this.contractController.vendorReplyRequest.bind(this.contractController),
		);
		//influencer reply request
		this.router.patch(
			"/influencer-reply-request/:contractId",
			authorizeUser,
			validateInputs(influencerReplyRequestSchema),
			this.contractController.influencerReplyRequest.bind(
				this.contractController,
			),
		);
	}

	public getContractRouter() {
		return this.router;
	}
}
