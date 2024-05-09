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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const utils_1 = require("../utils");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: "louisa.grimes@ethereal.email",
        pass: "DvG5nbAWYcE3AARzn3",
    },
});
function sendEmail(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        transporter.sendMail(payload, (err, info) => {
            if (err) {
                utils_1.log.error(err, "Error sending email");
                return;
            }
            utils_1.log.info(`Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
        });
    });
}
exports.sendEmail = sendEmail;
