import nodemailer, { SendMailOptions } from "nodemailer";
import { log } from "../utils";

const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: "marco.jerde@ethereal.email",
		pass: "A19G3ZZZyby9emAd8A",
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
