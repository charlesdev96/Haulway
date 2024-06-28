"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractRouter = void 0;
const express_1 = require("express");
const contractController_1 = require("../controller/contractController");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
class ContractRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.contractController = new contractController_1.ContractController();
        this.initializeRouter();
    }
    initializeRouter() {
        //vendor send influencer request
        this.router.post("/vendor-send-request", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.createContractSchema), this.contractController.vendorSendContractRequest.bind(this.contractController));
        //influencer send vendor request
        this.router.post("/influencer-send-request", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.createInfluencerContractSchema), this.contractController.influencerSendContractRequest.bind(this.contractController));
        //get single contract
        this.router.get("/get-single-contract/:contractId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.singleContractRequestSchema), this.contractController.getSingleContract.bind(this.contractController));
        //get single request
        this.router.get("/get-single-request/:contractId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.singleContractRequestSchema), this.contractController.getSingleRequest.bind(this.contractController));
        //vendor reply request
        this.router.patch("/vendor-reply-request/:contractId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.replyRequestSchema), this.contractController.vendorReplyRequest.bind(this.contractController));
        //influencer reply request
        this.router.patch("/influencer-reply-request/:contractId", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.influencerReplyRequestSchema), this.contractController.influencerReplyRequest.bind(this.contractController));
    }
    getContractRouter() {
        return this.router;
    }
}
exports.ContractRouter = ContractRouter;
