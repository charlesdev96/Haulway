import { config } from "dotenv";
config();
import request from "request";
import { log } from "./logger";

export const sendMail = async (email: string, code: number) => {
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
	request(options, function (error, response) {
		if (error) throw new Error(error);
		log.info(response.body);
	});
};
