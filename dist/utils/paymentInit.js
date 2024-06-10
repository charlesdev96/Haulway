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
exports.createPaymentIntent = exports.paymentInitializationFunction = void 0;
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
