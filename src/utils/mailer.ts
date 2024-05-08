import nodemailer, { SendMailOptions } from "nodemailer";
import { log } from "../utils";
import { config } from "dotenv";
config();

const pass = process.env.PASS;

const transporter = nodemailer.createTransport({
	host: "smtp-relay.brevo.com",
	port: 587,
	auth: {
		user: "ogonnayanc@gmail.com",
		pass: pass,
	},
});

export async function sendEmail(payload: SendMailOptions) {
	transporter.sendMail(payload, (err, info) => {
		if (err) {
			log.error(err, "Error sending email");
			return;
		}

		log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
	});
}
