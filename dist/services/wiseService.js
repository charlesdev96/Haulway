"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getToken = exports.getRecipientAccountId = exports.createRecipient = exports.createWallet = exports.createProfile = exports.getAccessToken = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const axios_1 = __importDefault(require("axios"));
const qs = __importStar(require("qs"));
const buffer_1 = require("buffer");
const clientId = "admin@grascope.com";
const clientSecret = "123@GRAScope.com";
const apiKey = process.env.WISE_API_TOKEN;
const tokenUrl = "https://api.sandbox.transferwise.tech/oauth/token";
const profileUrl = "https://api.sandbox.transferwise.tech/v2/profiles";
const walletUrl = "https://api.sandbox.transferwise.tech/v2/borderless-accounts";
// Function to authenticate and get access token using API key
const getAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // const encodedApiKey = Buffer.from(`${apiKey}:`).toString("base64");
        const response = yield axios_1.default.post(tokenUrl, {
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret,
            // api_key: apiKey,
        }, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });
        return response.data.access_token;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            throw new Error(`Failed to get access token due to: ${(_a = error.response) === null || _a === void 0 ? void 0 : _a.status} - ${(_b = error.response) === null || _b === void 0 ? void 0 : _b.statusText}`);
        }
        else if (error instanceof Error) {
            throw new Error(`Failed to get access token: ${error.message}`);
        }
        else {
            throw new Error("Failed to get access token");
        }
    }
});
exports.getAccessToken = getAccessToken;
// Function to create a profile
const createProfile = (accessToken, profileDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(profileUrl, {
            type: "personal", // or 'business'
            details: {
                firstName: profileDetails.firstName,
                lastName: profileDetails.lastName,
                dateOfBirth: profileDetails.dateOfBirth,
                phoneNumber: profileDetails.phoneNumber,
                email: profileDetails.email,
            },
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data.id;
    }
    catch (error) {
        throw new Error(`Failed to create profile: ${error}`);
    }
});
exports.createProfile = createProfile;
// Function to create a wallet
const createWallet = (accessToken, profileId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(walletUrl, {
            profile: profileId,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return response.data.id;
    }
    catch (error) {
        throw new Error(`Failed to create wallet: ${error}`);
    }
});
exports.createWallet = createWallet;
const createRecipient = (recipientDetails) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post("https://api.transferwise.com/v1/accounts", recipientDetails, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
    });
    return response.data.id; // This is the accountId
});
exports.createRecipient = createRecipient;
const getRecipientAccountId = (profileId, email) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`https://api.transferwise.com/v1/accounts?profile=${profileId}`, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
    });
    const recipient = response.data.find((account) => account.details.email === email);
    if (!recipient) {
        throw new Error("Recipient not found");
    }
    return recipient.id; // This is the accountId
});
exports.getRecipientAccountId = getRecipientAccountId;
const getToken = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(tokenUrl, qs.stringify({
            grant_type: "client_credentials",
        }), {
            auth: {
                username: clientId,
                password: clientSecret,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${buffer_1.Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
            },
        });
        console.log("Access Token:", response.data.access_token);
        return response.data.access_token;
    }
    catch (error) {
        console.error("Error fetching token:", error);
    }
});
exports.getToken = getToken;
