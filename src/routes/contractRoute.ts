import { Router } from "express";
import { ContractController } from "../controller/contractController";
import { authorizeUser, validateInputs } from "../middleware";
import { createContractSchema } from "../schema";

export class ContractRouter {
	private router: Router;
	private contractController: ContractController;
	constructor() {
		this.router = Router();
		this.contractController = new ContractController();
		this.initializeRouter();
	}

	private initializeRouter() {
		//vendor send influencer contract
		this.router.post(
			"/vendor-send-request",
			authorizeUser,
			validateInputs(createContractSchema),
			this.contractController.vendorSendContractRequest.bind(
				this.contractController,
			),
		);
	}

	public getContractRouter() {
		return this.router;
	}
}
