"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const http_status_codes_1 = require("http-status-codes");
const date_fns_1 = require("date-fns");
class ContractController {
    vendorSendContractRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const body = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found." });
                }
                //check if user is a vendor
                if (user.role !== "vendor") {
                    return res
                        .status(http_status_codes_1.StatusCodes.FORBIDDEN)
                        .json({ message: "only vendors are allowed to access this route" });
                }
                //send request to influencer
                body.vendor = userId;
                body.sentBy = "vendor";
                const influencer = yield (0, services_1.findUserById)(body.influencer);
                if (!influencer) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Influencer not found" });
                }
                const request = yield (0, services_1.createContract)(body);
                //send request to influencer and vendor
                (_b = influencer.requests) === null || _b === void 0 ? void 0 : _b.push(request._id);
                yield influencer.save();
                (_c = user.requests) === null || _c === void 0 ? void 0 : _c.push(request._id);
                yield user.save();
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    success: true,
                    message: `Request successfully sent to ${influencer.fullName}`,
                    data: request,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `An error occured while sending request to influencer ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while sending contract to influencer",
                    });
                }
            }
        });
    }
    vendorReplyRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const body = req.body;
                const { contractId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found." });
                }
                //check if contract exist
                const contract = yield (0, services_1.findContractById)(contractId);
                if (!contract || !contract.influencer) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "contract not found." });
                }
                //check if contract belongs to vendor
                if (((_b = contract.vendor) === null || _b === void 0 ? void 0 : _b.toString()) !== userId.toString()) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "You are not authorized to review this contract" });
                }
                //check if vendor have already rejected this course
                if (contract.actionType === "declined") {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "You have already declined this request" });
                }
                //check if vendor have already accepted the request
                if (contract.actionType === "accepted") {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "You have already accepted this request" });
                }
                const influencer = yield (0, services_1.findContractors)(contract.influencer);
                if (!influencer) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Influencer not found." });
                }
                if (body.percentage)
                    contract.percentage = body.percentage;
                if (body.actionType)
                    contract.actionType = body.actionType;
                if (body.timeFrame)
                    contract.timeFrame = body.timeFrame;
                if (body.products)
                    contract.products = body.products;
                if (body.actionType === "accepted") {
                    const days = Number(contract.timeFrame);
                    const contractExpirationDate = (0, date_fns_1.addDays)(new Date(), days);
                    contract.completionDate = contractExpirationDate;
                    contract.status = "active";
                    yield contract.save();
                    //filter out the contract id from their request
                    user.requests = (_c = user.requests) === null || _c === void 0 ? void 0 : _c.filter((request) => request.toString() !== contract._id.toString());
                    (_d = user.contracts) === null || _d === void 0 ? void 0 : _d.push(contractId);
                    influencer.requests = (_e = influencer.requests) === null || _e === void 0 ? void 0 : _e.filter((request) => request.toString() !== contract._id.toString());
                    (_f = influencer.contracts) === null || _f === void 0 ? void 0 : _f.push(contractId);
                    // Save user and influencer concurrently
                    yield Promise.all([user.save(), influencer.save()]);
                    const updatedContract = yield (0, services_1.findContractById)(contractId);
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "You have successfully responded to this request",
                        data: updatedContract,
                    });
                }
                else {
                    yield contract.save();
                    const updatedContract = yield (0, services_1.findContractById)(contractId);
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "You have successfully responded to this request",
                        data: updatedContract,
                    });
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `An error occured while replying request to influencer ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while replying request to  influencer",
                    });
                }
            }
        });
    }
    influencerSendContractRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const body = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found." });
                }
                //check if user is an influencer
                if (user.role !== "influencer") {
                    return res
                        .status(http_status_codes_1.StatusCodes.FORBIDDEN)
                        .json({ message: "only vendors are allowed to access this route" });
                }
                //send request to vendor
                body.influencer = userId;
                body.sentBy = "influencer";
                const vendor = yield (0, services_1.findUserById)(body.vendor);
                if (!vendor) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Vendor not found" });
                }
                const request = yield (0, services_1.createContract)(body);
                //send request to influencer and vendor
                (_b = vendor.requests) === null || _b === void 0 ? void 0 : _b.push(request._id);
                yield vendor.save();
                (_c = user.requests) === null || _c === void 0 ? void 0 : _c.push(request._id);
                yield user.save();
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    success: true,
                    message: `Request successfully sent to ${vendor.fullName}`,
                    data: request,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `An error occured while sending request to vendor ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while sending contract to vendor",
                    });
                }
            }
        });
    }
    influencerReplyRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const body = req.body;
                const { contractId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found." });
                }
                //check if contract exist
                const contract = yield (0, services_1.findContractById)(contractId);
                if (!contract || !contract.vendor) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "contract not found." });
                }
                //check if contract belongs to influencer
                if (((_b = contract.influencer) === null || _b === void 0 ? void 0 : _b.toString()) !== userId.toString()) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "You are not authorized to review this contract" });
                }
                //check if vendor have already rejected this course
                if (contract.actionType === "declined") {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "You have already declined this request" });
                }
                //check if influencer have already accepted the request
                if (contract.actionType === "accepted") {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "You have already accepted this request" });
                }
                const vendor = yield (0, services_1.findContractors)(contract.vendor);
                if (!vendor) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Vendor not found." });
                }
                if (body.percentage)
                    contract.percentage = body.percentage;
                if (body.actionType)
                    contract.actionType = body.actionType;
                if (body.timeFrame)
                    contract.timeFrame = body.timeFrame;
                if (body.products)
                    contract.products = body.products;
                if (body.actionType === "accepted") {
                    const days = Number(contract.timeFrame);
                    const contractExpirationDate = (0, date_fns_1.addDays)(new Date(), days);
                    contract.completionDate = contractExpirationDate;
                    contract.status = "active";
                    yield contract.save();
                    //filter out the contract id from their request
                    user.requests = (_c = user.requests) === null || _c === void 0 ? void 0 : _c.filter((request) => request.toString() !== contract._id.toString());
                    (_d = user.contracts) === null || _d === void 0 ? void 0 : _d.push(contractId);
                    vendor.requests = (_e = vendor.requests) === null || _e === void 0 ? void 0 : _e.filter((request) => request.toString() !== contract._id.toString());
                    (_f = vendor.contracts) === null || _f === void 0 ? void 0 : _f.push(contractId);
                    // Save user and vendor concurrently
                    yield Promise.all([user.save(), vendor.save()]);
                    const updatedContract = yield (0, services_1.findContractById)(contractId);
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "You have successfully responded to this request",
                        data: updatedContract,
                    });
                }
                else {
                    yield contract.save();
                    const updatedContract = yield (0, services_1.findContractById)(contractId);
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "You have successfully responded to this request",
                        data: updatedContract,
                    });
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `An error occured while replying request to vendor ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while replying request to vendor",
                    });
                }
            }
        });
    }
}
exports.ContractController = ContractController;
