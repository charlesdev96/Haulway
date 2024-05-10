import { Router } from "express";
import { FilesUpload } from "../controller/fileUploadController";

export class FilesUploadRouter {
	private router: Router;
	private fileUpload: FilesUpload;
	constructor() {
		this.router = Router();
		this.fileUpload = new FilesUpload();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		//upload files route
		this.router.post(
			"/file-upload",
			this.fileUpload.uploadDocuments.bind(this.fileUpload),
		);
	}
	public getFiles() {
		return this.router;
	}
}
