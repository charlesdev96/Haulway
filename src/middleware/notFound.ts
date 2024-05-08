import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const notFound = async (req: Request, res: Response): Promise<any> => {
	res
		.status(StatusCodes.NOT_FOUND)
		.json(
			"Opps!. It seems like the route you selected does not exist. Please choose another route or contact support for assistance...",
		);
};
