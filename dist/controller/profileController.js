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
exports.profiles = void 0;
const services_1 = require("../services");
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../utils");
class profiles {
    userProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                if (!role) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.userData)(role.toString(), userId.toString());
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "User profile retrieved successfully.",
                    data: user,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Unable to display user profile",
                    error: error,
                });
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const body = req.body;
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found." });
                }
                const updateUser = user;
                //update properties individually
                if (body.fullName) {
                    updateUser.fullName = body.fullName;
                    yield updateUser.save();
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: `Profile information updated. Your full name is now ${body.fullName}`,
                    });
                }
                if (body.profilePic) {
                    updateUser.profilePic = body.profilePic;
                    yield updateUser.save();
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: `Profile picture have been updated successfully`,
                    });
                }
                if (body.password && body.oldPassword) {
                    const { password } = updateUser;
                    //check if oldpassword matches current password
                    const isPasswordCorrect = yield (0, services_1.validatePassword)(body.oldPassword, password);
                    if (!isPasswordCorrect) {
                        return res
                            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                            .json({ message: "old password must match current password" });
                    }
                    updateUser.password = body.password;
                    yield updateUser.save();
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "User password updated successfully",
                    });
                }
                if (body.userName) {
                    //check if username exist
                    body.userName = `@${body.userName}`;
                    const existingUsername = yield (0, services_1.userNameExist)(body.userName);
                    //check if username belong to user
                    if (((_b = existingUsername === null || existingUsername === void 0 ? void 0 : existingUsername.userName) === null || _b === void 0 ? void 0 : _b.toString()) === body.userName.toString()) {
                        return res
                            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                            .json({ message: `${body.userName} is already assigned to you` });
                    }
                    if (existingUsername) {
                        const message = `Oops! Username ${body.userName} already taken. Please choose a different one.`;
                        utils_1.log.info(message);
                        return res
                            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                            .json({ success: false, message: message });
                    }
                    else {
                        const message = `The chosen username ${body.userName} is available.`;
                        utils_1.log.info(message);
                    }
                    updateUser.userName = body.userName;
                    yield updateUser.save();
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: `The chosen username ${body.userName} is available and assigned to you.`,
                    });
                }
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    success: true,
                    message: "User account was not updated",
                });
            }
            catch (error) {
                utils_1.log.info(error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: error,
                    message: "Unable to update account.",
                });
            }
        });
    }
    upgradeAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const body = req.body;
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found." });
                }
                const updateUser = user;
                //check if user has already upgraded
                if (updateUser.role !== "user") {
                    return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                        message: `You have already changed your role once to ${updateUser.role}. Further changes are not permitted.`,
                    });
                }
                if (body.role === "vendor" || body.role === "influencer") {
                    //create a store for vendor
                    if (!body.store) {
                        return res
                            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                            .json({ message: "Please fill up store properties" });
                    }
                    else {
                        //store name must be unique
                        const storeNameExist = yield (0, services_1.findStoreByName)(body.store.storeName.toString().toUpperCase());
                        if (storeNameExist) {
                            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                                mesage: `Store name ${body.store.storeName} already exist, please choose another name`,
                            });
                        }
                        //if store name does not exist, proceed to create store
                        body.store.owner = userId.toString();
                        body.store.role = body.role;
                        const newStore = yield (0, services_1.createStore)(body.store);
                        updateUser.store = newStore._id;
                        //update user account
                        updateUser.role = body.role;
                        yield updateUser.save();
                        res.status(http_status_codes_1.StatusCodes.OK).json({
                            success: true,
                            message: `Congratulations, Your account has been successfully upgraded to ${body.role}!!!`,
                        });
                    }
                }
                else {
                    //update user account
                    updateUser.role = body.role;
                    yield updateUser.save();
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: `Congratulations, Your account has been successfully upgraded to ${body.role}!!!`,
                    });
                }
            }
            catch (error) {
                utils_1.log.info(error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: error,
                    message: "Unable to update account.",
                });
            }
        });
    }
    deleteAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield (0, services_1.existingUser)(email);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "User not found" });
                }
                yield user.deleteOne();
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ success: true, message: "User account successfully deleted" });
            }
            catch (error) {
                utils_1.log.info(error.message);
                res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "Unable to delete account" });
            }
        });
    }
}
exports.profiles = profiles;
function elseif() {
    throw new Error("Function not implemented.");
}
