import { config } from "dotenv";
config();
import { log } from "../utils";

import Stripe from "stripe";

// Ensure the Stripe API key is available
const stripeApiKey: string | undefined = process.env.STRIPE_SECRET_KEY;
if (!stripeApiKey) {
	throw new Error("Missing Stripe API Secret in environment variables");
}
const stripe = new Stripe(stripeApiKey);

export const paymentInitializationFunction = async (
	price: number,
	quantity: number,
	productName: string,
) => {
	try {
		const session = await stripe.checkout.sessions.create({
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
	} catch (error: unknown) {
		if (error instanceof Error) {
			log.info(error.message);
			throw error;
		} else {
			log.info(error);
			throw error;
		}
	}
};

export const createPaymentIntent = async (
	price: number,
	quantity: number,
	productName: string,
): Promise<{ clientSecret: string; paymentIntentId: string }> => {
	try {
		const amount = price * quantity * 100; // Calculate the total amount

		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency: "usd",
			payment_method_types: ["card"],
			description: `Payment for ${quantity}x ${productName}`,
		});

		return {
			clientSecret: paymentIntent.client_secret || "",
			paymentIntentId: paymentIntent.id,
		};
	} catch (error: unknown) {
		if (error instanceof Error) {
			log.info(error.message);
			throw error;
		} else {
			log.info(error);
			throw error;
		}
	}
};
