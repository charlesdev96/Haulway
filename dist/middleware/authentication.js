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
exports.authorizeUser = void 0;
const utils_1 = require("../utils");
const http_status_codes_1 = require("http-status-codes");
const authorizeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .json({ error: "Authentication invalid" });
    }
    const token = authHeader.split(" ")[1];
    try {
        // Check if token is valid and get payload
        const payload = (0, utils_1.isTokenValid)({ token });
        // Attach the user to the request object
        req.user = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        };
        next();
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .json({ message: "Authentication invalids", error: error });
    }
});
exports.authorizeUser = authorizeUser;
