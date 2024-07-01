import { config } from "dotenv";
config();

import axios from "axios";
import * as qs from "qs";
import { Buffer } from "buffer";

interface RecipientDetails {
	currency: "USD";
	type: "email";
	profile: string;
	email: string;
}

const clientId = "admin@grascope.com";
const clientSecret = "123@GRAScope.com";
const apiKey: string | undefined = process.env.WISE_API_TOKEN;
const tokenUrl: string = "https://api.sandbox.transferwise.tech/oauth/token";
const profileUrl: string = "https://api.sandbox.transferwise.tech/v2/profiles";
const walletUrl: string =
	"https://api.sandbox.transferwise.tech/v2/borderless-accounts";

// Function to authenticate and get access token using API key
export const getAccessToken = async (): Promise<string> => {
	try {
		// const encodedApiKey = Buffer.from(`${apiKey}:`).toString("base64");
		const response = await axios.post(
			tokenUrl,
			{
				grant_type: "client_credentials",
				client_id: clientId,
				client_secret: clientSecret,
				// api_key: apiKey,
			},
			{
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
				},
			},
		);

		return response.data.access_token;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				`Failed to get access token due to: ${error.response?.status} - ${error.response?.statusText}`,
			);
		} else if (error instanceof Error) {
			throw new Error(`Failed to get access token: ${error.message}`);
		} else {
			throw new Error("Failed to get access token");
		}
	}
};

// Function to create a profile
export const createProfile = async (
	accessToken: string,
	profileDetails: {
		firstName: string;
		lastName: string;
		dateOfBirth: string;
		phoneNumber: string;
		email: string;
	},
): Promise<string> => {
	try {
		const response = await axios.post(
			profileUrl,
			{
				type: "personal", // or 'business'
				details: {
					firstName: profileDetails.firstName,
					lastName: profileDetails.lastName,
					dateOfBirth: profileDetails.dateOfBirth,
					phoneNumber: profileDetails.phoneNumber,
					email: profileDetails.email,
				},
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
			},
		);

		return response.data.id;
	} catch (error) {
		throw new Error(`Failed to create profile: ${error}`);
	}
};

// Function to create a wallet
export const createWallet = async (
	accessToken: string,
	profileId: string,
): Promise<string> => {
	try {
		const response = await axios.post(
			walletUrl,
			{
				profile: profileId,
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
			},
		);

		return response.data.id;
	} catch (error) {
		throw new Error(`Failed to create wallet: ${error}`);
	}
};

export const createRecipient = async (
	recipientDetails: RecipientDetails,
): Promise<string> => {
	const response = await axios.post(
		"https://api.transferwise.com/v1/accounts",
		recipientDetails,
		{
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
		},
	);
	return response.data.id; // This is the accountId
};

export const getRecipientAccountId = async (
	profileId: string,
	email: string,
): Promise<string> => {
	const response = await axios.get(
		`https://api.transferwise.com/v1/accounts?profile=${profileId}`,
		{
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
		},
	);

	const recipient = response.data.find(
		(account: any) => account.details.email === email,
	);
	if (!recipient) {
		throw new Error("Recipient not found");
	}
	return recipient.id; // This is the accountId
};

export const getToken = async () => {
	try {
		const response = await axios.post(
			tokenUrl,
			qs.stringify({
				grant_type: "client_credentials",
			}),
			{
				auth: {
					username: clientId,
					password: clientSecret,
				},
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
				},
			},
		);

		console.log("Access Token:", response.data.access_token);
		return response.data.access_token;
	} catch (error) {
		console.error("Error fetching token:", error);
	}
};
