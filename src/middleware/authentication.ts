import { Request, Response, NextFunction } from "express";
import { isTokenValid } from "../utils";
import { StatusCodes } from "http-status-codes";

interface TokenPayLoad {
	userId: string;
	email: string;
}

interface CustomRequest extends Request {
	user?: {
		userId: string;
		email: string;
	};
}

export const authorizeUser = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	// Check header
	const authHeader: string | undefined = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ error: "Authentication invalid" });
	}
	const token = authHeader.split(" ")[1];
	try {
		// Check if token is valid and get payload
		const payload = isTokenValid({ token }) as TokenPayLoad;

		// Attach the user to the request object
		req.user = {
			userId: payload.userId,
			email: payload.email,
		};
		next();
	} catch (error: any) {
		res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ message: "Authentication invalids", error: error });
	}
};
