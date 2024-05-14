"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const schema_1 = require("../schema");
const middleware_1 = require("../middleware");
class authRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userAuthentication = new authController_1.authController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //register user
        this.router.post("/register", (0, middleware_1.validateInputs)(schema_1.registerUserSchema), this.userAuthentication.register.bind(this.userAuthentication));
        //resend verification email
        this.router.post("/resend-email", middleware_1.authorizeUser, this.userAuthentication.resendVerificationEmail.bind(this.userAuthentication));
        //verify user
        this.router.post("/verify-account", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.verifyUserSchema), this.userAuthentication.verifyUserAccount.bind(this.userAuthentication));
        //login router
        this.router.post("/login", (0, middleware_1.validateInputs)(schema_1.loginSchema), this.userAuthentication.login.bind(this.userAuthentication));
        //forgot password
        this.router.post("/forgot-password", (0, middleware_1.validateInputs)(schema_1.forgotPasswordSchema), this.userAuthentication.forgotPassword.bind(this.userAuthentication));
        //resend password otp
        this.router.post("/resend-forgot-password", middleware_1.authorizeUser, this.userAuthentication.resendForgotPassword.bind(this.userAuthentication));
        //verify otp
        this.router.post("/verify-otp", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.verifyPasswordOtpSchema), this.userAuthentication.verifyPasswordOtp.bind(this.userAuthentication));
        //reset password
        this.router.post("/reset-password", middleware_1.authorizeUser, (0, middleware_1.validateInputs)(schema_1.resetPasswordSchema), this.userAuthentication.resetPassword.bind(this.userAuthentication));
    }
    getAuthRouter() {
        return this.router;
    }
}
exports.authRoute = authRoute;
