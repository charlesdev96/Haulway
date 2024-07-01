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
exports.createPaymentIntent = exports.paymentInitializationFunction = exports.deleteStripeAccount = exports.checkAccountStatus = exports.generateStripeAccountLink = exports.generateStripeDashboardLink = exports.createStripeAccount = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const utils_1 = require("../utils");
const stripe_1 = __importDefault(require("stripe"));
// Ensure the Stripe API key is available
const stripeApiKey = process.env.STRIPE_SECRET_KEY;
if (!stripeApiKey) {
    throw new Error("Missing Stripe API Secret in environment variables");
}
const stripe = new stripe_1.default(stripeApiKey);
const createStripeAccount = (email, country) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield stripe.accounts.create({
            type: "express",
            email: email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            country: country,
        });
        return account.id;
    }
    catch (error) {
        utils_1.log.info("Error creating Stripe account:", error);
        throw error;
    }
});
exports.createStripeAccount = createStripeAccount;
const generateStripeDashboardLink = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginLink = yield stripe.accounts.createLoginLink(accountId);
        return loginLink.url;
    }
    catch (error) {
        utils_1.log.info("Error generating Stripe dashboard link:", error);
        throw error;
    }
});
exports.generateStripeDashboardLink = generateStripeDashboardLink;
const generateStripeAccountLink = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountLink = yield stripe.accountLinks.create({
            account: accountId,
            type: "account_onboarding",
            // refresh_url: "https://your-app.com/reauth",
            // return_url: "https://your-app.com/dashboard",
        });
        return accountLink.url; // Return the URL for the user to verify their account
    }
    catch (error) {
        utils_1.log.info("Error generating Stripe account link:", error);
        throw error;
    }
});
exports.generateStripeAccountLink = generateStripeAccountLink;
const checkAccountStatus = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield stripe.accounts.retrieve(accountId);
        return account.details_submitted;
    }
    catch (error) {
        utils_1.log.error("Error checking account status:", error);
        throw error;
    }
});
exports.checkAccountStatus = checkAccountStatus;
const deleteStripeAccount = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedAccount = yield stripe.accounts.del(accountId);
        return deletedAccount; // Returns the deleted account object
    }
    catch (error) {
        console.error("Error deleting Stripe account:", error);
        throw error;
    }
});
exports.deleteStripeAccount = deleteStripeAccount;
const paymentInitializationFunction = (price, quantity, productName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: productName,
                        },
                        unit_amount: price * 100, // Amount in smallest currency unit (pence for GBP)
                    },
                    quantity: quantity,
                },
            ],
            mode: "payment",
            success_url: "https://your-success-url.com/success",
            cancel_url: "https://your-cancel-url.com/cancel",
        });
        return session.url || "";
    }
    catch (error) {
        if (error instanceof Error) {
            utils_1.log.info(error.message);
            throw error;
        }
        else {
            utils_1.log.info(error);
            throw error;
        }
    }
});
exports.paymentInitializationFunction = paymentInitializationFunction;
const createPaymentIntent = (price, quantity, productName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const amount = price * quantity * 100; // Calculate the total amount
        const paymentIntent = yield stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method_types: ["card"],
            description: `Payment for ${quantity}x ${productName}`,
        });
        return {
            clientSecret: paymentIntent.client_secret || "",
            paymentIntentId: paymentIntent.id,
        };
    }
    catch (error) {
        if (error instanceof Error) {
            utils_1.log.info(error.message);
            throw error;
        }
        else {
            utils_1.log.info(error);
            throw error;
        }
    }
});
exports.createPaymentIntent = createPaymentIntent;
