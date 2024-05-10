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
class profiles {
    userProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
                if (!email) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.userProfile)(email);
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
                //update properties individually
                if (body.fullName) {
                    updateUser.fullName = body.fullName;
                }
                if (body.profilePic) {
                    updateUser.profilePic = body.profilePic;
                }
                if (body.password && body.oldPassword) {
                    const _b = updateUser, { password } = _b, userData = __rest(_b, ["password"]);
                    //check if oldpassword matches current password
                    const isPasswordCorrect = yield (0, services_1.validatePassword)(body.oldPassword, password);
                    if (!isPasswordCorrect) {
                        return res
                            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                            .json({ error: "old password must match current password" });
                    }
                    updateUser.password = body.password;
                }
                if (body.userName) {
                    //check if username exist
                    const existingUsername = yield (0, services_1.userNameExist)(body.userName);
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
                }
                //save the updated user
                yield updateUser.save();
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "User account updated successfully",
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
}
exports.profiles = profiles;
