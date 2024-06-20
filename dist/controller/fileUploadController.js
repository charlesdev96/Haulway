"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesUpload = void 0;
const cloudinary_1 = require("cloudinary");
const http_status_codes_1 = require("http-status-codes");
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
//configure cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
class FilesUpload {
    uploadDocuments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //check when no files is uploaded
                if (!req.files || Object.keys(req.files).length === 0) {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: "No files were uploaded.",
                    });
                }
                // const results = [];
                const results = [];
                //check if req.files.files is an array or single file
                const filesArray = Array.isArray(req.files.files)
                    ? req.files.files
                    : [req.files.files];
                //loop through each uploaded file
                for (const file of filesArray) {
                    //update the cloudinary upload options to support videos
                    const result = yield cloudinary_1.v2.uploader.upload(file.tempFilePath, {
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
                    fs_1.default.unlink(file.tempFilePath, (unlinkError) => {
                        if (unlinkError) {
                            utils_1.log.info(`Error deleting temporary file: ${unlinkError}`);
                        }
                        else {
                            utils_1.log.info(`Temporary file deleted: ${file.tempFilePath}`);
                        }
                    });
                    // results.push({ src: result.secure_url });
                    // Prepare the file data including the thumbnail if it is a video
                    const fileData = { src: result.secure_url };
                    if (result.resource_type === "video" &&
                        result.eager &&
                        result.eager.length > 0) {
                        fileData.thumbNail = result.eager[0].secure_url;
                    }
                    results.push(fileData);
                }
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: "File successfully uploaded to Cloudinary!",
                    files: results,
                });
            }
            catch (error) {
                utils_1.log.info(error);
                res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "Unable to upload files" });
            }
        });
    }
}
exports.FilesUpload = FilesUpload;
