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
const services_1 = require("../services");
const utils_1 = require("../utils");
const http_status_codes_1 = require("http-status-codes");
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
                const origin = "https://haulway-icj2.onrender.com/api/v1";
                const verifyEmail = `${origin}/auth/verify-email/${_id}/${verificationCode}`;
                const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}">Verify Email</a> </p>`;
                yield (0, utils_1.sendEmail)({
                    to: email,
                    from: "test@example.com",
                    subject: "Verify your email/account",
                    html: `<h4> Hello, ${body.fullName} </h4> ${message}`,
                });
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    message: "User successfully registered, please check your mail to verify your account.",
                });
            }
            catch (error) {
                utils_1.log.info(error);
                utils_1.log.info("Unable to create user");
                res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Unable to resend email user" });
            }
        });
    }
    resendVerificationEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const user = yield (0, services_1.findUserById)(id);
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
                const origin = "https://haulway-icj2.onrender.com/api/v1";
                const verifyEmail = `${origin}/auth/verify-email/${user._id}/${user.verificationCode}`;
                const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}">Verify Email</a> </p>`;
                yield (0, utils_1.sendEmail)({
                    to: email === null || email === void 0 ? void 0 : email.toString(),
                    from: "test@example.com",
                    subject: "Verify your email/account",
                    html: `<h4> Hello, ${user.fullName} </h4> ${message}`,
                });
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ message: "Verification email resent successfully" });
            }
            catch (error) {
                utils_1.log.info(error);
                utils_1.log.info("Unable to resend email user");
                res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ message: "Unable to resend email user" });
            }
        });
    }
}
exports.authController = authController;
