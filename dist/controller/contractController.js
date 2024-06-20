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
                        message: `An error occured while sending request to vendor or influencer ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while sending contract to vendor or influencer",
                    });
                }
            }
        });
    }
}
exports.ContractController = ContractController;
