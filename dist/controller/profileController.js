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
            var _a;
            try {
                const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
                if (!email) {
                    return res
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Unauthorized: Missing authentication token." });
                }
                const user = yield (0, services_1.userProfile)(email);
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({
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
}
exports.profiles = profiles;
