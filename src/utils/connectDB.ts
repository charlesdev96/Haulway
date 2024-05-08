import { config } from "dotenv";
config();

import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { log } from "../utils";
import { Request, Response } from "express";

export const connectDB = async (req: Request, res: Response) => {
	try {
		const MONGO_URL: string | null | undefined = process.env.MONGO_URL;
		if (!MONGO_URL) {
			return res
				.status(StatusCodes.FORBIDDEN)
				.json({ error: "MONGO_URI environment variable is not defined." });
		}
		await mongoose.connect(MONGO_URL);
		log.info("MongoDB connected successfully!");
	} catch (error: any) {
		log.info(error);
	}
};
