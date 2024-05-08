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
exports.connectDB = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../utils");
const connectDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MONGO_URL = process.env.MONGO_URL;
        if (!MONGO_URL) {
            return res
                .status(http_status_codes_1.StatusCodes.FORBIDDEN)
                .json({ error: "MONGO_URI environment variable is not defined." });
        }
        yield mongoose_1.default.connect(MONGO_URL);
        utils_1.log.info("MongoDB connected successfully!");
    }
    catch (error) {
        utils_1.log.info(error);
    }
});
exports.connectDB = connectDB;