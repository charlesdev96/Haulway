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
exports.StripeController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const services_2 = require("../services");
const http_status_codes_1 = require("http-status-codes");
const model_1 = require("../model");
class StripeController {
    stripeOnBoarding(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const body = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                //find logged in user
                const user = yield (0, services_2.findUserById)(userId);
                //check if user exist
                if (!user || !user.email) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                //check user already have a stripe id
                // if (user.stripe_id) {
                // 	const checkStatus = await checkAccountStatus(user.stripe_id);
                // 	if (checkStatus) {
                // 		const link = await generateStripeDashboardLink(user.stripe_id);
                // 		user.stripe_url = link;
                // 		await user.save();
                // 		return res.status(StatusCodes.OK).json({
                // 			message:
                // 				"User already has a Stripe account and fully onboarded, visit your Stripe profile using the provided link",
                // 			data: link,
                // 		});
                // 	}
                // 	const link = await generateStripeAccountLink(user.stripe_id);
                // 	return res.status(StatusCodes.OK).json({
                // 		message:
                // 			"User already have a stripe id, visit your stripe profile using the provided link and complete your registration",
                // 		data: link,
                // 	});
                // }
                //generate stripe account for user
                const stripeAccount = yield (0, services_1.createStripeAccount)(user.email, body.country);
                //return verification link if successful
                if (stripeAccount) {
                    const link = yield (0, services_1.generateStripeAccountLink)(stripeAccount.toString());
                    // user.stripe_url = link;
                    // user.stripe_id = stripeAccount.toString();
                    // await user.save();
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "Stripe account successfully generated",
                        data: link,
                    });
                }
                else {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "Unable to complete conboarding" });
                }
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to onboard user to stripe due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while onboarding user to stripe",
                    });
                }
            }
        });
    }
    deleteStripeAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { stripeId } = req.params;
                const user = yield model_1.UserModel.findOne({ stripe_id: stripeId });
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                //proceed to delete stripe account
                yield (0, services_1.deleteStripeAccount)(stripeId.toString());
                // user.stripe_id = null;
                // user.stripe_url = null;
                yield user.save();
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ message: "stripe account deleted successfully" });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to delete stripe account due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while deleting stripe account",
                    });
                }
            }
        });
    }
    checkOnboardingStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { stripeId } = req.params;
                const user = yield model_1.UserModel.findOne({ stripe_id: stripeId });
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                const status = yield (0, services_1.checkAccountStatus)(stripeId);
                res.status(http_status_codes_1.StatusCodes.OK).json({ data: status });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to check stripe account status due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while checking stripe account status",
                    });
                }
            }
        });
    }
}
exports.StripeController = StripeController;
