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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const request_1 = __importDefault(require("request"));
const logger_1 = require("./logger");
const sendMail = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    var data = {
        api_key: process.env.TERMII_API_KEY,
        email_address: email,
        code: `${code}`,
        email_configuration_id: process.env.TERMII_email_configuration_id,
    };
    var options = {
        method: "POST",
        url: "https://api.ng.termii.com/api/email/otp/send",
        headers: {
            "Content-Type": ["application/json", "application/json"],
        },
        body: JSON.stringify(data),
    };
    (0, request_1.default)(options, function (error, response) {
        if (error)
            throw new Error(error);
        logger_1.log.info(response.body);
    });
});
exports.sendMail = sendMail;
