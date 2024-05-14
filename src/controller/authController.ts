import { config } from "dotenv";
config();
import { Request, Response } from "express";
import {
	registerUserInputs,
	verifyUserInputs,
	loginInputs,
	forgotPasswordInputs,
	resetPasswordInputs,
	verifyPasswordOtpInputs,
} from "../schema";
import {
	registerUser,
	existingUser,
	findUserById,
	CustomRequest,
	validatePassword,
	userProfile,
} from "../services";
import { log, createJWT, sendMail } from "../utils";
import { StatusCodes } from "http-status-codes";
import { customAlphabet } from "nanoid";

//generate token
function generateToken() {
	const numericAlphabet = "0123456789";
	const token = customAlphabet("0123456789", 5);
	return token();
}

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
			const otp: number = Number(generateToken());
			body.otp = otp;
			const user = await registerUser(body);

			//send email with verification code
			const { _id, email, ...userDAta } = user as {
				_id: string;
				email: string;
			};

			//send email with otp
			await sendMail(body.email, otp);
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
			if (error && error.code === 11000) {
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
			const email: string | undefined = req.user?.email;
			if (!userId || !email) {
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
			const otp = user?.otp;
			if (!otp) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Missing otp" });
			}
			//resend email
			await sendMail(email, otp);
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

	public async verifyUserAccount(req: CustomRequest, res: Response) {
		try {
			const { otp } = req.body as verifyUserInputs;

			// find the user by id
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
					.json({ success: false, message: "User is already verified" });
			}

			// check to see if the verificationCode matches
			if (user.otp?.toString() !== otp.toString()) {
				return res
					.status(StatusCodes.OK)
					.json({ success: true, message: "Invalid or expired OTP code" });
			}

			user.verified = true;
			(user.otp = null), await user.save();
			res.status(StatusCodes.OK).json({
				success: true,
				message: `Verification successful for the email: ${user.email}`,
			});
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
			const { email } = req.body as forgotPasswordInputs;
			const message: string =
				"If a user with that email is registered you will receive a password reset email";
			//check if user exist
			const user = await existingUser(email);
			if (!user) {
				log.info(`User with email: ${email} does not exist`);
				return res
					.status(StatusCodes.OK)
					.json({ success: true, message, token: "" });
			}
			if (!user.verified) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ success: false, message: "User not verified" });
			}
			//generate otp
			const otp: number = Number(generateToken());
			user.otp = otp;
			await user.save();

			//send email with otp
			await sendMail(email, otp);
			const payload: object = {
				userId: user._id,
				email: user.email,
				role: user.role,
			};
			const token = createJWT({ payload });
			res
				.status(StatusCodes.OK)
				.json({ success: true, message: message, token });
		} catch (error: any) {
			log.info(error.message);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
				success: false,
				message: "Unable to send mail",
				error: error.message,
			});
		}
	}

	public async resendForgotPassword(req: CustomRequest, res: Response) {
		try {
			const userId: string | undefined = req.user?.userId;
			const email: string | undefined = req.user?.email;
			if (!userId || !email) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Sorry, can not re-send forgot password code" });
			}
			// check to see if they are already verified
			if (!user.verified) {
				return res
					.status(StatusCodes.OK)
					.json({ message: "User is is not verified" });
			}
			const otp = user?.otp;
			if (!otp) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Missing otp" });
			}
			//resend email
			await sendMail(email, otp);
			res.status(StatusCodes.OK).json({
				success: true,
				message: "Forgot password email resent successfully",
			});
		} catch (error: any) {
			log.info(error);
			log.info("Unable to register user");
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: "Unable to resend forgot password mail",
			});
		}
	}

	public async verifyPasswordOtp(req: CustomRequest, res: Response) {
		try {
			const { otp } = req.body as verifyPasswordOtpInputs;
			const userId: string | undefined = req.user?.userId;
			const email: string | undefined = req.user?.email;
			if (!userId || !email) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Sorry, can not re-send forgot password code" });
			}
			// check to see if they are already verified
			if (!user.verified) {
				return res
					.status(StatusCodes.OK)
					.json({ message: "User is is not verified" });
			}
			//check if otp is correct
			if (otp.toString() !== user.otp?.toString()) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Invalid or expired otp" });
			}

			//set otp to null
			user.otp = null;
			await user.save();
			res.status(StatusCodes.OK).json({
				success: true,
				message: "Password OTP verified successfully",
			});
		} catch (error: any) {
			log.info(error.message);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({
					success: false,
					message: "Unable to verify otp",
					error: error.message,
				});
		}
	}

	public async resetPassword(req: CustomRequest, res: Response) {
		try {
			const { password } = req.body as resetPasswordInputs;
			const userId: string | undefined = req.user?.userId;
			const email: string | undefined = req.user?.email;
			if (!userId || !email) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: "Unauthorized: Missing authentication token." });
			}
			const user = await findUserById(userId);
			if (!user) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ message: "Sorry, can not re-send forgot password code" });
			}
			// check to see if they are already verified
			if (!user.verified) {
				return res
					.status(StatusCodes.OK)
					.json({ message: "User is is not verified" });
			}

			//save the new password
			user.password = password;
			await user.save();
			res
				.status(StatusCodes.OK)
				.json({ success: true, message: "Password reset successfully" });
		} catch (error: any) {
			log.info(error.message);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: "Unable to reset password",
				error: error.message,
			});
		}
	}
}
