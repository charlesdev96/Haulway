"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesUploadRouter = void 0;
const express_1 = require("express");
const fileUploadController_1 = require("../controller/fileUploadController");
class FilesUploadRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.fileUpload = new fileUploadController_1.FilesUpload();
        this.initializeRoutes();
    }
    initializeRoutes() {
        //upload files route
        this.router.post("/file-upload", this.fileUpload.uploadDocuments.bind(this.fileUpload));
    }
    getFiles() {
        return this.router;
    }
}
exports.FilesUploadRouter = FilesUploadRouter;
