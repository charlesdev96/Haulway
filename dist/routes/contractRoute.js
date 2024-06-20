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
        //vendor send influencer contract
        this.router.post("/vendor-send-request", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.createContractSchema), this.contractController.vendorSendContractRequest.bind(this.contractController));
    }
    getContractRouter() {
        return this.router;
    }
}
exports.ContractRouter = ContractRouter;
