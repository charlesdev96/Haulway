import { v2 as cloudinary } from "cloudinary";
import { StatusCodes } from "http-status-codes";
import fs from "fs";
import { Request, Response } from "express";
import { log } from "../utils";

//configure cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface FileData {
	src: string;
	thumbNail?: string;
}

export class FilesUpload {
	public async uploadDocuments(req: Request, res: Response) {
		try {
			//check when no files is uploaded
			if (!req.files || Object.keys(req.files).length === 0) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					success: false,
					message: "No files were uploaded.",
				});
			}

			// const results = [];
			const results: FileData[] = [];

			//check if req.files.files is an array or single file
			const filesArray = Array.isArray(req.files.files)
				? req.files.files
				: [req.files.files];
			//loop through each uploaded file
			for (const file of filesArray) {
				//update the cloudinary upload options to support videos
				const result = await cloudinary.uploader.upload(file.tempFilePath, {
					resource_type: "auto", //Automatically detect the file type
					folder: "haulway",
					eager: [
						{
							width: 300,
							height: 300,
							crop: "pad",
							format: "jpg",
							resource_type: "video",
						},
					],
				});

				//Remove the temporary file
				fs.unlink(file.tempFilePath, (unlinkError) => {
					if (unlinkError) {
						log.info(`Error deleting temporary file: ${unlinkError}`);
					} else {
						log.info(`Temporary file deleted: ${file.tempFilePath}`);
					}
				});
				// results.push({ src: result.secure_url });
				// Prepare the file data including the thumbnail if it is a video
				const fileData: FileData = { src: result.secure_url };
				if (
					result.resource_type === "video" &&
					result.eager &&
					result.eager.length > 0
				) {
					fileData.thumbNail = result.eager[0].secure_url;
				}

				results.push(fileData);
			}
			return res.status(StatusCodes.OK).json({
				success: true,
				message: "File successfully uploaded to Cloudinary!",
				files: results,
			});
		} catch (error: any) {
			log.info(error);
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Unable to upload files" });
		}
	}
}
