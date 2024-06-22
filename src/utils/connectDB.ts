import { config } from "dotenv";
config();

import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { log } from "../utils";
import { Request, Response } from "express";
import { StoreModel } from "../model";

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

export const deletePostsByUser = async () => {
	try {
		// Delete posts where postedBy is the specified userId
		const result = await StoreModel.deleteMany({
			owner: "666accb5498e380670ab398c",
		});
		console.log(`${result.deletedCount} posts deleted`);

		// Close the database connection
		await mongoose.disconnect();
		console.log("Disconnected from the database");
	} catch (error) {
		console.error("Error deleting posts:", error);
	}
};

// const defaultThumbnailUrl =
// 	"https://res.cloudinary.com/dvrg4hiwx/image/upload/v1718886492/haulway/guoiliffqahxrx5aya9l.png";

// export const populateThumbNails = async () => {
// 	const postsToUpdate = await PostModel.find({ thumbNail: { $exists: false } });

// 	for (const post of postsToUpdate) {
// 		const numImages = post?.content?.length; // Assuming content is an array of strings
// 		const defaultThumbNail = []; // Array to store default thumbnails

// 		// Generating default thumbnail URLs based on the provided default URL
// 		for (let i = 0; i < numImages; i++) {
// 			defaultThumbNail.push(defaultThumbnailUrl);
// 		}

// 		// Update the post with the default thumbnail URLs
// 		post.thumbNail = defaultThumbNail;
// 		await post.save();
// 		console.log(
// 			`Updated post ${post._id} with ${numImages} default thumbnails.`,
// 		);
// 	}

// 	console.log("All posts updated successfully.");
// 	mongoose.connection.close();
// };
