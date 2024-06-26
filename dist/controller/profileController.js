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
exports.profiles = void 0;
const services_1 = require("../services");
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../utils");
const model_1 = require("../model");
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
                const user = yield (0, services_1.getUserProfile)(userId);
                const postTaged = yield (0, services_1.getAllPostTaged)(userId);
                const output = Object.assign(Object.assign({}, user === null || user === void 0 ? void 0 : user.toObject()), { postTaged });
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "User profile retrieved successfully.",
                    data: output,
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
                const updateUser = user;
                //check if user has already upgraded
                if (updateUser.role !== "user") {
                    return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                        message: `You have already changed your role once to ${updateUser.role}. Further changes are not permitted.`,
                    });
                }
                if (body.role === "vendor") {
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
                else if (body.role === "influencer") {
                    //create a store for vendor
                    if (!body.store) {
                        return res
                            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                            .json({ message: "Please fill up store properties" });
                    }
                    else {
                        //store name must be unique
                        const storeNameExist = yield (0, services_1.findInfluencerStoreByName)(body.store.storeName.toString().toUpperCase());
                        if (storeNameExist) {
                            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                                mesage: `Store name ${body.store.storeName} already exist, please choose another name`,
                            });
                        }
                        //if store name does not exist, proceed to create store
                        body.store.owner = userId.toString();
                        body.store.role = body.role;
                        const newStore = yield (0, services_1.createInfluencerStore)(body.store);
                        updateUser.influencerStore = newStore._id;
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
                if (error.code === 11000) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "store name already exist",
                    });
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An error occured while trying to update account",
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        error: error,
                        message: "Unable to update account.",
                    });
                }
            }
        });
    }
    updateStore(req, res) {
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
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "User not found." });
                }
                //find user store
                if (user.role === "vendor") {
                    const store = yield (0, services_1.findStoreByUserId)(userId);
                    if (!store) {
                        return res
                            .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                            .json({ message: "Store not found" });
                    }
                    //if store exist update the store
                    if (body.storeDesc)
                        store.storeDesc = body.storeDesc;
                    if (body.storeLogo)
                        store.storeLogo = body.storeLogo;
                    if (body.storeName)
                        store.storeName = body.storeName;
                    //save the newly updated store
                    yield store.save();
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "Congratulations, the store has been successfully updated.",
                    });
                }
                else {
                    const store = yield (0, services_1.findInfluencerStoreByUserId)(userId);
                    if (!store) {
                        return res
                            .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                            .json({ message: "Store not found" });
                    }
                    //if store exist update the store
                    if (body.storeDesc)
                        store.storeDesc = body.storeDesc;
                    if (body.storeLogo)
                        store.storeLogo = body.storeLogo;
                    if (body.storeName)
                        store.storeName = body.storeName;
                    //save the newly updated store
                    yield store.save();
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "Congratulations, the store has been successfully updated.",
                    });
                }
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
                        return res
                            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                            .json({ message: "Wrong Id format" });
                    }
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to update store due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while updating store",
                    });
                }
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
                const userId = user._id;
                //delete user posts
                yield model_1.PostModel.deleteMany({ postedBy: userId.toString() });
                //delete all user comments
                yield model_1.CommentModel.deleteMany({ commentedBy: userId.toString() });
                //delete product reviews
                yield model_1.ProductReviewModel.deleteMany({ reviewer: userId.toString() });
                //delete users reply
                yield model_1.ReplyModel.deleteMany({ replier: userId.toString() });
                if (user.role === "user") {
                    yield user.deleteOne();
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "User account successfully deleted",
                    });
                }
                else if (user.role === "vendor") {
                    yield model_1.StoreModel.deleteMany({ owner: userId.toString() });
                    yield model_1.VendorProductModel.deleteMany({ vendor: userId.toString() });
                    yield user.deleteOne();
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "User account successfully deleted",
                    });
                }
                else if (user.role === "influencer") {
                    yield model_1.InfluencerStoreModel.deleteMany({ owner: userId.toString() });
                    yield model_1.InfluencerProductModel.deleteMany({
                        influencer: userId.toString(),
                    });
                    yield user.deleteOne();
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "User account successfully deleted",
                    });
                }
                else {
                    yield user.deleteOne();
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        success: true,
                        message: "User account successfully deleted",
                    });
                }
            }
            catch (error) {
                utils_1.log.info(error.message);
                res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "Unable to delete account" });
            }
        });
    }
    vendorProfile(req, res) {
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
                if (user.role !== "vendor") {
                    return res
                        .status(http_status_codes_1.StatusCodes.FORBIDDEN)
                        .json({ message: "only vendors are allowed to access this route" });
                }
                const profile = yield (0, services_1.getVendorProfile)(userId);
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ success: true, message: "Vendor profile", data: profile });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: `Unable to update store due to: ${error.message}`,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An unknown error occurred while updating store",
                    });
                }
            }
        });
    }
    vendorStore(req, res) {
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
                if (!user.store) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "You are not allowed to access this route" });
                }
                const userStore = yield (0, services_1.getVendorStore)(user.store);
                if (!userStore) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Store not found" });
                }
                const _b = userStore.toObject(), { productSales, totalOrders, totalOrdersDelivered, numOfPendingOrders, totalSales, totalOrderAmount } = _b, remainingData = __rest(_b, ["productSales", "totalOrders", "totalOrdersDelivered", "numOfPendingOrders", "totalSales", "totalOrderAmount"]);
                const stats = {
                    productSales,
                    totalOrders,
                    totalOrdersDelivered,
                    numOfPendingOrders,
                };
                const overview = {
                    totalSales,
                    totalOrderAmount,
                };
                const vendorStore = Object.assign({ stats,
                    overview }, remainingData);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "Vendor store successfully retrieved",
                    data: vendorStore,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An error occured while trying to get vendor store",
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        error: error,
                        message: "Unable to get vendor store.",
                    });
                }
            }
        });
    }
    influencerProfile(req, res) {
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
                if (user.role !== "influencer") {
                    return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                        message: "Only influencers are allowed to access this route",
                    });
                }
                const profile = yield (0, services_1.getInfluencerProfile)(userId);
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ success: true, message: "Influencer profile", data: profile });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An error occured while trying to get influencer profile",
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        error: error,
                        message: "Unable to get influencer profile.",
                    });
                }
            }
        });
    }
    influencerStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
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
                if (!user.influencerStore) {
                    return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                        message: "Only influencers are allowed to access this route",
                    });
                }
                const store = yield (0, services_1.getInfluencerStore)(user.influencerStore);
                if (!store) {
                    return res
                        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                        .json({ message: "Store not found" });
                }
                store.accountEngaged = (_b = user.contracts) === null || _b === void 0 ? void 0 : _b.length;
                store.accountReached =
                    (((_c = user.contracts) === null || _c === void 0 ? void 0 : _c.length) || 0) + (((_d = user.requests) === null || _d === void 0 ? void 0 : _d.length) || 0);
                yield store.save();
                const _e = store.toObject(), { accountReached, accountEngaged } = _e, remainingData = __rest(_e, ["accountReached", "accountEngaged"]);
                const stats = {
                    accountReached,
                    accountEngaged,
                    totalFollowers: user.numOfFollowers,
                };
                const influencerStore = Object.assign({ stats }, remainingData);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "Influencer store successfully retrieved",
                    data: influencerStore,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "An error occured while trying to get influencer store",
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        error: error,
                        message: "Unable to get influencer store.",
                    });
                }
            }
        });
    }
}
exports.profiles = profiles;
