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
exports.validatePassword = exports.userProfile = exports.findUserById = exports.existingUser = exports.registerUser = void 0;
const model_1 = require("../model");
const lodash_1 = require("lodash");
const bcryptjs_1 = require("bcryptjs");
const registerUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.UserModel.create(input);
        return (0, lodash_1.omit)(user, "password");
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.registerUser = registerUser;
const existingUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.UserModel.findOne({ email: email });
});
exports.existingUser = existingUser;
const findUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.UserModel.findOne({ _id: userId });
});
exports.findUserById = findUserById;
const userProfile = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.UserModel.findOne({ email: email }).select("-password -verificationCode -passwordResetCode");
});
exports.userProfile = userProfile;
const validatePassword = (userPassword, canditatePassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, bcryptjs_1.compare)(userPassword, canditatePassword);
});
exports.validatePassword = validatePassword;
