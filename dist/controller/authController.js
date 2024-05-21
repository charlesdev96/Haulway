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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const services_1 = require("../services");
const utils_1 = require("../utils");
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = __importDefault(require("lodash"));
//create 6 digits verification
function generateOTP(length) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return lodash_1.default.random(min, max).toString();
}
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
                // const otp: number = Number(generateToken());
                const otp = Number(generateOTP(5));
                body.otp = otp;
                const user = yield (0, services_1.registerUser)(body);
                //send email with verification code
                const _a = user, { _id, email } = _a, userDAta = __rest(_a, ["_id", "email"]);
                //send email with otp
                yield (0, utils_1.sendMail)(body.email, otp);
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
                utils_1.log.info(error.message);
                if (error && error.code === 11000) {
                    // Duplicate key error
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "Username already exists" });
                }
                utils_1.log.info("Unable to create user");
                res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "Unable to resend email user" });
            }
        });
    }
    resendVerificationEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const email = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email;
                if (!userId || !email) {
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
                const otp = user === null || user === void 0 ? void 0 : user.otp;
                if (!otp) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "Missing otp" });
                }
                //resend email
                yield (0, utils_1.sendMail)(email, otp);
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
            var _a, _b;
            try {
                const { otp } = req.body;
                // find the user by id
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
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ success: false, message: "User is already verified" });
                }
                // check to see if the verificationCode matches
                if (((_b = user.otp) === null || _b === void 0 ? void 0 : _b.toString()) !== otp.toString()) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ success: true, message: "Invalid or expired OTP code" });
                }
                user.verified = true;
                (user.otp = null), yield user.save();
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: `Verification successful for the email: ${user.email}`,
                });
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
                const { email } = req.body;
                const message = "If a user with that email is registered you will receive a password reset email";
                //check if user exist
                const user = yield (0, services_1.existingUser)(email);
                if (!user) {
                    utils_1.log.info(`User with email: ${email} does not exist`);
                    return res
                        .status(http_status_codes_1.StatusCodes.OK)
                        .json({ success: true, message, token: "" });
                }
                if (!user.verified) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ success: false, message: "User not verified" });
                }
                //generate otp
                // const otp: number = Number(generateToken());
                const otp = Number(generateOTP(5));
                user.otp = otp;
                yield user.save();
                //send email with otp
                yield (0, utils_1.sendMail)(email, otp);
                const payload = {
                    userId: user._id,
                    email: user.email,
                    role: user.role,
                };
                const token = (0, utils_1.createJWT)({ payload });
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ success: true, message: message, token });
            }
            catch (error) {
                utils_1.log.info(error.message);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
                    success: false,
                    message: "Unable to send mail",
                    error: error.message,
                });
            }
        });
    }
    resendForgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const email = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email;
                if (!userId || !email) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "Sorry, can not re-send forgot password code" });
                }
                // check to see if they are already verified
                if (!user.verified) {
                    return res
                        .status(http_status_codes_1.StatusCodes.OK)
                        .json({ message: "User is is not verified" });
                }
                const otp = user === null || user === void 0 ? void 0 : user.otp;
                if (!otp) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "Missing otp" });
                }
                //resend email
                yield (0, utils_1.sendMail)(email, otp);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "Forgot password email resent successfully",
                });
            }
            catch (error) {
                utils_1.log.info(error);
                utils_1.log.info("Unable to register user");
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Unable to resend forgot password mail",
                });
            }
        });
    }
    verifyPasswordOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const { otp } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const email = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email;
                if (!userId || !email) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "Sorry, can not re-send forgot password code" });
                }
                // check to see if they are already verified
                if (!user.verified) {
                    return res
                        .status(http_status_codes_1.StatusCodes.OK)
                        .json({ message: "User is is not verified" });
                }
                //check if otp is correct
                if (otp.toString() !== ((_c = user.otp) === null || _c === void 0 ? void 0 : _c.toString())) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "Invalid or expired otp" });
                }
                //set otp to null
                user.otp = null;
                yield user.save();
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "Password OTP verified successfully",
                });
            }
            catch (error) {
                utils_1.log.info(error.message);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Unable to verify otp",
                    error: error.message,
                });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { password } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const email = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email;
                if (!userId || !email) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.findUserById)(userId);
                if (!user) {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json({ message: "Sorry, can not re-send forgot password code" });
                }
                // check to see if they are already verified
                if (!user.verified) {
                    return res
                        .status(http_status_codes_1.StatusCodes.OK)
                        .json({ message: "User is is not verified" });
                }
                //save the new password
                user.password = password;
                yield user.save();
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ success: true, message: "Password reset successfully" });
            }
            catch (error) {
                utils_1.log.info(error.message);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Unable to reset password",
                    error: error.message,
                });
            }
        });
    }
}
exports.authController = authController;
