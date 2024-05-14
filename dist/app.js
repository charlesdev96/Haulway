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
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const middleware_1 = require("./middleware");
const routes_1 = __importDefault(require("./routes/routes"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const app = (0, express_1.default)();
const router = new routes_1.default();
//use middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, express_fileupload_1.default)({ useTempFiles: true, createParentPath: true }));
//use router here
app.use(router.getRouter());
//not found middleware
app.use(middleware_1.notFound);
const port = process.env.PORT || 3000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, utils_1.connectDB)({}, {});
        yield (0, utils_1.deleteUnverifiedUsers)();
        yield utils_1.userCreatedEmitter;
        app.listen(port, () => {
            utils_1.log.info(`Server running on port ${port}...`);
        });
    }
    catch (error) {
        utils_1.log.info("Unable to start app");
    }
});
start();
