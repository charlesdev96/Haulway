import nodemailer, { SendMailOptions } from "nodemailer";
import { log } from "../utils";
import { config } from "dotenv";
config();

const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: "louisa.grimes@ethereal.email",
		pass: "DvG5nbAWYcE3AARzn3",
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
