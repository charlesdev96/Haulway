import { Request, Response } from "express";
import { registerUserInputs } from "../schema";
import { registerUser, existingUser } from "../services";
import { log, createJWT, sendEmail } from "../utils";
import { nanoid } from "nanoid";
import { StatusCodes } from "http-status-codes";

export class authController {
	public async register(
		req: Request<{}, {}, registerUserInputs>,
		res: Response,
	) {
		try {
			const body = req.body as registerUserInputs;
			const userExist = await existingUser(body.email);
			//if userexist return error
			if (userExist) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "User already exist" });
			}
			//create user if user does not exist
			const user = await registerUser(body);

			//send email with verification code
			const { verificationCode, _id, email, ...userDAta } = user as {
				verificationCode: string;
				_id: string;
				email: string;
			};
			await sendEmail({
				to: email,
				from: "test@example.com",
				subject: "Verify your email/account",
				text: `verification code: ${verificationCode} and your Id is: ${_id}`,
			});
			res.status(StatusCodes.CREATED).json({
				message:
					"User successfully registered, please check your mail to verify your account.",
			});
		} catch (error: any) {
			log.info(error);
			log.info("Unable to create user");
		}
	}
}
