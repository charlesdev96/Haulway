import { config } from "dotenv";
config();
import { Request, Response } from "express";
import {
	registerUserInputs,
	verifyUserInputs,
	loginInputs,
	forgotPasswordInputs,
	resetPasswordInputs,
} from "../schema";
import {
	registerUser,
	existingUser,
	findUserById,
	CustomRequest,
	validatePassword,
	userProfile,
} from "../services";
import { log, createJWT, sendEmail } from "../utils";
import { StatusCodes } from "http-status-codes";
import { nanoid } from "nanoid";

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
			const origin = process.env.ORIGIN;
			const verifyEmail = `${origin}/auth/verify-account/${_id}/${verificationCode}`;
			const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}">Verify Email</a> </p>`;
			await sendEmail({
				to: email,
				from: "test@example.com",
				subject: "Verify your email/account",
				html: `<h4> Hello, ${body.fullName} </h4> ${message}`,
			});
			const payload: object = {
				userId: user._id,
				email: user.email,
				role: user.role,
			};

			const token = createJWT({ payload });
			res.status(StatusCodes.CREATED).json({
				success: true,
				message:
					"User successfully registered, please check your mail to verify your account.",
				token,
			});
		} catch (error: any) {
			log.info(error.message);
			if (error.code === 11000) {
				// Duplicate key error
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Username already exists" });
			}
			log.info("Unable to create user");
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Unable to resend email user" });
		}
	}

	public async resendVerificationEmail(req: CustomRequest, res: Response) {
		try {
			const userId: string | undefined = req.user?.userId;
			if (!userId) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
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
			const origin = process.env.ORIGIN;
			const verifyEmail = `${origin}/auth/verify-account/${user._id}/${user.verificationCode}`;
			const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}">Verify Email</a> </p>`;
			await sendEmail({
				to: email?.toString(),
				from: "test@example.com",
				subject: "Verify your email/account",
				html: `<h4> Hello, ${user.fullName} </h4> ${message}`,
			});
			res.status(StatusCodes.OK).json({
				success: true,
				message: "Verification email resent successfully",
			});
		} catch (error: any) {
			log.info(error);
			log.info("Unable to register user");
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Unable to register user" });
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
					.json({ success: false, message: "Could not verify user" });
			}

			// check to see if they are already verified
			if (user.verified) {
				return res
					.status(StatusCodes.OK)
					.json({ success: false, message: "User is already verified" });
			}

			// check to see if the verificationCode matches
			if (user.verificationCode === verificationCode) {
				user.verified = true;
				user.verificationCode = null;
				await user.save();
				return res
					.status(StatusCodes.OK)
					.json({ success: true, message: "User successfully verified" });
			}
			//if conditions not certified
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ success: false, message: "Could not verify user" });
		} catch (error: any) {
			log.info(error);
			if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
				return res.json({ message: "Wrong Id format" });
			}
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Could not verify user" });
		}
	}

	public async login(req: Request<{}, {}, loginInputs>, res: Response) {
		try {
			const body = req.body as loginInputs;
			const message = "Invalid email or password";
			const user = await existingUser(body.email);
			if (!user) {
				return res.status(StatusCodes.BAD_REQUEST).json({ message: message });
			}
			if (!user.verified) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ success: false, message: "Please verify your email" });
			}
			//check user password
			const { password, ...userData } = user as { password: string };
			const checkPassword: boolean = await validatePassword(
				body.password,
				password,
			);
			if (!checkPassword) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ success: false, message });
			}

			//token payload
			const payload: object = {
				userId: user._id,
				email: user.email,
				role: user.role,
			};

			const token = createJWT({ payload });
			const data = await userProfile(body.email);
			res.status(200).json({
				success: true,
				message: `Welcome back ${user.fullName} to Haulway App.`,
				data: data,
				token,
			});
		} catch (error: any) {
			log.info(error);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Unable to login user", error });
		}
	}

	public async forgotPassword(
		req: Request<{}, {}, forgotPasswordInputs>,
		res: Response,
	) {
		try {
			const body = req.body as forgotPasswordInputs;
			const message: string =
				"If a user with that email is registered you will receive a password reset email";
			//check if user exist
			const user = await existingUser(body.email);
			if (!user) {
				log.info(`User with email: ${body.email} does not exist`);
				return res
					.status(StatusCodes.OK)
					.json({ success: true, message, token: "" });
			}
			if (!user.verified) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ success: false, message: "User not verified" });
			}
			const passwordResetCode = nanoid();
			user.passwordResetCode = passwordResetCode;
			await user.save();
			const origin = process.env.ORIGIN;
			const resetPassword = `${origin}/auth/reset-password?id=${user._id}&passwordCode=${passwordResetCode}&password=${body.password}&email=${body.email}`;
			const emailMesaage = `<p>Please confirm your password reset by clicking on the following link: <a href="${resetPassword}">Reset password email</a> </p>`;
			await sendEmail({
				to: body.email,
				from: "test@example.com",
				subject: "Verify your email/account",
				html: `<h4> Hello, ${user.fullName} </h4> ${emailMesaage}`,
			});
			log.info(`id: ${user._id}, passwordCode: ${passwordResetCode}`);
			res.status(StatusCodes.OK).json({ success: true, message: message });
		} catch (error: any) {
			log.info(error.message);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
				success: false,
				message: "Unable to send message",
				error: error.message,
			});
		}
	}

	public async resetPassword(
		req: Request<{}, {}, {}, resetPasswordInputs>,
		res: Response,
	) {
		try {
			const query = req.query as resetPasswordInputs;
			const user = await existingUser(query.email);
			if (!user) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ success: false, message: "Unable to change password" });
			}
			if (
				user.email !== query.email ||
				user.passwordResetCode !== query.passwordCode
			) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ sucess: false, message: "Invalid query parameters" });
			}
			user.password = query.password;
			user.passwordResetCode = null;
			await user.save();
			res
				.status(StatusCodes.OK)
				.json({ success: true, message: "Successfully updated password" });
		} catch (error: any) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
				message: "Unable to verify password reset code",
				error: error.message,
			});
		}
	}
}
