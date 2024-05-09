import { Request, Response } from "express";
import { registerUserInputs, verifyUserInputs } from "../schema";
import {
	registerUser,
	existingUser,
	findUserById,
	CustomRequest,
} from "../services";
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
			const origin: string = "https://haulway-icj2.onrender.com/api/v1";
			const verifyEmail = `${origin}/auth/verify-email/${_id}/${verificationCode}`;
			const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}">Verify Email</a> </p>`;
			await sendEmail({
				to: email,
				from: "test@example.com",
				subject: "Verify your email/account",
				html: `<h4> Hello, ${body.fullName} </h4> ${message}`,
			});
			res.status(StatusCodes.CREATED).json({
				message:
					"User successfully registered, please check your mail to verify your account.",
			});
		} catch (error: any) {
			log.info(error);
			log.info("Unable to create user");
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Unable to resend email user" });
		}
	}

	public async resendVerificationEmail(req: CustomRequest, res: Response) {
		try {
			const userId: string | undefined = req.user?.userId;
			if (!userId) {
				return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Sorry, can not re-send verification code" });
			}
			// check to see if they are already verified
			if (user.verified) {
				return res
					.status(StatusCodes.OK)
					.json({ message: "User is already verified" });
			}
			const email = user.email;
			const origin: string = "https://haulway-icj2.onrender.com/api/v1";
			const verifyEmail = `${origin}/auth/verify-email/${user._id}/${user.verificationCode}`;
			const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}">Verify Email</a> </p>`;
			await sendEmail({
				to: email?.toString(),
				from: "test@example.com",
				subject: "Verify your email/account",
				html: `<h4> Hello, ${user.fullName} </h4> ${message}`,
			});
			res
				.status(StatusCodes.OK)
				.json({ message: "Verification email resent successfully" });
		} catch (error: any) {
			log.info(error);
			log.info("Unable to resend email user");
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Unable to resend email user" });
		}
	}

	public async verifyUserAccount(
		req: Request<verifyUserInputs, {}, {}>,
		res: Response,
	) {
		try {
			const { id, verificationCode } = req.params as verifyUserInputs;

			// find the user by id
			const user = await findUserById(id);

			if (!user) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Could not verify user" });
			}

			// check to see if they are already verified
			if (user.verified) {
				return res
					.status(StatusCodes.OK)
					.json({ message: "User is already verified" });
			}

			// check to see if the verificationCode matches
			if (user.verificationCode === verificationCode) {
				user.verified = true;
				user.verificationCode = null;
				await user.save();
				return res
					.status(StatusCodes.OK)
					.json({ message: "User successfully verified" });
			}
			//if conditions not certified
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: "Could not verify user" });
		} catch (error: any) {
			log.info(error);
			if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
				return res.json({ message: "Wrong Id format" });
			}
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Could not verify user" });
		}
	}
}
