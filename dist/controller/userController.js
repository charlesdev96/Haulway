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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const services_1 = require("../services");
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../utils");
class UserController {
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
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
                const users = yield (0, services_1.getAllUser)(userId.toString());
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "All users retrieved successfully.",
                    data: users,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Unable to display all users",
                    error: error,
                });
            }
        });
    }
    getSingleUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
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
                const singleUserData = yield (0, services_1.singleUser)(id);
                if (!singleUserData) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found." });
                }
                //data returned should depend on the role of the user
                const postTaged = yield (0, services_1.getAllPostTaged)(id);
                const updatedData = [singleUserData];
                const outputData = (updatedData || []).map((data) => {
                    var _a;
                    let status = "follow";
                    // Check if userId is in the followers array
                    if ((_a = data.followers) === null || _a === void 0 ? void 0 : _a.includes(userId.toString())) {
                        status = "following";
                    }
                    // Remove the followers field from postedBy
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const _b = data._doc, { followers } = _b, userDetails = __rest(_b, ["followers"]);
                    return Object.assign(Object.assign({ status: status }, userDetails), { postTaged });
                });
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "User retrieved successfully.",
                    data: outputData,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: `Unable to display all user info due to: ${error.mesage}`,
                });
            }
        });
    }
    getAllVendors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
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
                const vendors = yield (0, services_1.getAllUsersByRole)("vendor", userId);
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ success: true, message: "List of all vendors", data: vendors });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `An error occured while getting all vendors due to ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while getting all vendors",
                    });
                }
            }
        });
    }
    getAllVendorsForContract(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
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
                const vendors = yield (0, services_1.getAllUsersByRoleForContract)("vendor", userId);
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ success: true, message: "List of all vendors", data: vendors });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `An error occured while getting all vendors due to ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while getting all vendors",
                    });
                }
            }
        });
    }
    getAllInfluencers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
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
                const influencers = yield (0, services_1.getAllUsersByRole)("influencer", userId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "List of all influencers",
                    data: influencers,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `An error occured while getting all influencers due to ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while getting all influencers",
                    });
                }
            }
        });
    }
    getAllInfluencersForContracts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
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
                const influencers = yield (0, services_1.getAllUsersByRoleForContract)("influencer", userId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "List of all influencers",
                    data: influencers,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `An error occured while getting all influencers due to ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while getting all influencers",
                    });
                }
            }
        });
    }
    searchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { search } = req.query;
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
                const users = yield (0, services_1.searchForUsers)(search, userId);
                //if nothing is found return empty array
                if (!users ||
                    users.length === 0 ||
                    search === null ||
                    search === undefined ||
                    search === "") {
                    return res
                        .status(http_status_codes_1.StatusCodes.OK)
                        .json({ success: true, message: "No user found", data: [] });
                }
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "List of searched users",
                    data: users,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `An error occured while searching for users ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while getting searched users",
                    });
                }
            }
        });
    }
    searchForVendors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { search } = req.query;
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
                const vendors = yield (0, services_1.searchUsersByRole)(search, "vendor", userId);
                //if nothing is found return empty array
                if (!vendors ||
                    vendors.length === 0 ||
                    search === null ||
                    search === undefined ||
                    search === "") {
                    return res
                        .status(http_status_codes_1.StatusCodes.OK)
                        .json({ success: true, message: "No vendor found", data: [] });
                }
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "List of searched vendors",
                    data: vendors,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `An error occured while searching for vendors ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while getting searched vendors",
                    });
                }
            }
        });
    }
    searchForInfluencers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { search } = req.query;
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
                const influencers = yield (0, services_1.searchUsersByRole)(search, "influencer", userId);
                //if nothing is found return empty array
                if (!influencers ||
                    influencers.length === 0 ||
                    search === null ||
                    search === undefined ||
                    search === "") {
                    return res
                        .status(http_status_codes_1.StatusCodes.OK)
                        .json({ success: true, message: "No influencer found", data: [] });
                }
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "List of searched influencer",
                    data: influencers,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `An error occured while searching for influencer ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while getting searched influencer",
                    });
                }
            }
        });
    }
}
exports.UserController = UserController;
