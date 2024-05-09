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
exports.authController = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const services_1 = require("../services");
const utils_1 = require("../utils");
const http_status_codes_1 = require("http-status-codes");
const nanoid_1 = require("nanoid");
class authController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const userExist = yield (0, services_1.existingUser)(body.email);
                //if userexist return error
                if (userExist) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "User already exist" });
                }
                //create user if user does not exist
                const user = yield (0, services_1.registerUser)(body);
                //send email with verification code
                const _a = user, { verificationCode, _id, email } = _a, userDAta = __rest(_a, ["verificationCode", "_id", "email"]);
                const origin = process.env.ORIGIN;
                const verifyEmail = `${origin}/auth/verify-account/${_id}/${verificationCode}`;
                const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}">Verify Email</a> </p>`;
                yield (0, utils_1.sendEmail)({
                    to: email,
                    from: "test@example.com",
                    subject: "Verify your email/account",
                    html: `<h4> Hello, ${body.fullName} </h4> ${message}`,
                });
                const payload = {
                    userId: user._id,
                    email: user.email,
                    role: user.role,
                };
                const token = (0, utils_1.createJWT)({ payload });
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    success: true,
                    message: "User successfully registered, please check your mail to verify your account.",
                    token,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                utils_1.log.info("Unable to create user");
                res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "Unable to resend email user" });
            }
        });
    }
    resendVerificationEmail(req, res) {
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
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "Sorry, can not re-send verification code" });
                }
                // check to see if they are already verified
                if (user.verified) {
                    return res
                        .status(http_status_codes_1.StatusCodes.OK)
                        .json({ message: "User is already verified" });
                }
                const email = user.email;
                const origin = process.env.ORIGIN;
                const verifyEmail = `${origin}/auth/verify-account/${user._id}/${user.verificationCode}`;
                const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}">Verify Email</a> </p>`;
                yield (0, utils_1.sendEmail)({
                    to: email === null || email === void 0 ? void 0 : email.toString(),
                    from: "test@example.com",
                    subject: "Verify your email/account",
                    html: `<h4> Hello, ${user.fullName} </h4> ${message}`,
                });
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "Verification email resent successfully",
                });
            }
            catch (error) {
                utils_1.log.info(error);
                utils_1.log.info("Unable to register user");
                res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "Unable to register user" });
            }
        });
    }
    verifyUserAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, verificationCode } = req.params;
                // find the user by id
                const user = yield (0, services_1.findUserById)(id);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ success: false, message: "Could not verify user" });
                }
                // check to see if they are already verified
                if (user.verified) {
                    return res
                        .status(http_status_codes_1.StatusCodes.OK)
                        .json({ success: false, message: "User is already verified" });
                }
                // check to see if the verificationCode matches
                if (user.verificationCode === verificationCode) {
                    user.verified = true;
                    user.verificationCode = null;
                    yield user.save();
                    return res
                        .status(http_status_codes_1.StatusCodes.OK)
                        .json({ success: true, message: "User successfully verified" });
                }
                //if conditions not certified
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ success: false, message: "Could not verify user" });
            }
            catch (error) {
                utils_1.log.info(error);
                if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
                    return res.json({ message: "Wrong Id format" });
                }
                res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "Could not verify user" });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const message = "Invalid email or password";
                const user = yield (0, services_1.existingUser)(body.email);
                if (!user) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: message });
                }
                if (!user.verified) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ success: false, message: "Please verify your email" });
                }
                //check user password
                const _a = user, { password } = _a, userData = __rest(_a, ["password"]);
                const checkPassword = yield (0, services_1.validatePassword)(body.password, password);
                if (!checkPassword) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ success: false, message });
                }
                //token payload
                const payload = {
                    userId: user._id,
                    email: user.email,
                    role: user.role,
                };
                const token = (0, utils_1.createJWT)({ payload });
                const data = yield (0, services_1.userProfile)(body.email);
                res.status(200).json({
                    success: true,
                    message: `Welcome back ${user.fullName} to Haulway App.`,
                    data: data,
                    token,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "Unable to login user", error });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const message = "If a user with that email is registered you will receive a password reset email";
                //check if user exist
                const user = yield (0, services_1.existingUser)(body.email);
                if (!user) {
                    utils_1.log.info(`User with email: ${body.email} does not exist`);
                    return res
                        .status(http_status_codes_1.StatusCodes.OK)
                        .json({ success: true, message, token: "" });
                }
                if (!user.verified) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ success: false, message: "User not verified" });
                }
                const passwordResetCode = (0, nanoid_1.nanoid)();
                user.passwordResetCode = passwordResetCode;
                yield user.save();
                const origin = process.env.ORIGIN;
                const resetPassword = `${origin}/auth/reset-password?id=${user._id}&passwordCode=${passwordResetCode}&password=${body.password}&email=${body.email}`;
                const emailMesaage = `<p>Please confirm your password reset by clicking on the following link: <a href="${resetPassword}">Reset password email</a> </p>`;
                yield (0, utils_1.sendEmail)({
                    to: body.email,
                    from: "test@example.com",
                    subject: "Verify your email/account",
                    html: `<h4> Hello, ${user.fullName} </h4> ${emailMesaage}`,
                });
                utils_1.log.info(`id: ${user._id}, passwordCode: ${passwordResetCode}`);
                res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: message });
            }
            catch (error) {
                utils_1.log.info(error.message);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
                    success: false,
                    message: "Unable to send message",
                    error: error.message,
                });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const user = yield (0, services_1.existingUser)(query.email);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ success: false, message: "Unable to change password" });
                }
                if (user.email !== query.email ||
                    user.passwordResetCode !== query.passwordCode) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ sucess: false, message: "Invalid query parameters" });
                }
                user.password = query.password;
                user.passwordResetCode = null;
                yield user.save();
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ success: true, message: "Successfully updated password" });
            }
            catch (error) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
                    message: "Unable to verify password reset code",
                    error: error.message,
                });
            }
        });
    }
}
exports.authController = authController;
