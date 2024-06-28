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
exports.WiseController = void 0;
const services_1 = require("../services");
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../utils");
class WiseController {
    createUserProfile(req, res) {
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
                const user = yield (0, services_1.findUserById)(userId);
                //check if user exist
                if (!user || !user.role || !user.email) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found" });
                }
                if (user.role !== "influencer" && user.role !== "vendor") {
                    return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                        message: "only vendors and influencers are allowed to access this route",
                    });
                }
                //check if user have an existing profileId
                if (body.profileId && body.walletId) {
                    if (user.role === "influencer") {
                        const influencerStore = yield (0, services_1.findInfluencerStoreByUserId)(userId);
                        if (!influencerStore) {
                            return res
                                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                                .json({ message: "influencer store not found" });
                        }
                        influencerStore.profileId = body.profileId;
                        influencerStore.walletId = body.walletId;
                        yield influencerStore.save();
                        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                            success: true,
                            message: "Wise profile successfully created",
                        });
                    }
                    else {
                        const store = yield (0, services_1.findStoreByUserId)(userId);
                        if (!store) {
                            return res
                                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                                .json({ message: "vendor store not found" });
                        }
                        store.profileId = body.profileId;
                        store.walletId = body.walletId;
                        yield store.save();
                        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                            success: true,
                            message: "Wise profile successfully created",
                        });
                    }
                }
                const accessToken = yield (0, services_1.getAccessToken)();
                const profileId = yield (0, services_1.createProfile)(accessToken, body);
                if (!profileId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "Unable to create profile id" });
                }
                const walletId = yield (0, services_1.createWallet)(accessToken, profileId);
                if (!walletId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "Unable to create wallet id" });
                }
                const output = { profileId: profileId, walletId: walletId };
                if (user.role === "influencer") {
                    const influencerStore = yield (0, services_1.findInfluencerStoreByUserId)(userId);
                    if (!influencerStore) {
                        return res
                            .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                            .json({ message: "influencer store not found" });
                    }
                    influencerStore.profileId = profileId;
                    influencerStore.walletId = walletId;
                    yield influencerStore.save();
                    utils_1.log.info(output);
                    return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                        success: true,
                        message: "Wise profile successfully created",
                    });
                }
                else {
                    const store = yield (0, services_1.findStoreByUserId)(userId);
                    if (!store) {
                        return res
                            .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                            .json({ message: "vendor store not found" });
                    }
                    store.profileId = profileId;
                    store.walletId = walletId;
                    yield store.save();
                    utils_1.log.info(output);
                    return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                        success: true,
                        message: "Wise profile successfully created",
                    });
                }
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to get all vendor product due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while getting vendor product",
                    });
                }
            }
        });
    }
}
exports.WiseController = WiseController;
