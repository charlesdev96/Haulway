import { config } from "dotenv";
config();
import express, { Request, Response, Express, NextFunction } from "express";
import { connectDB, log } from "./utils";
import { notFound } from "./middleware";
import RouterConfig from "./routes/routes";
import helmet from "helmet";
import cors from "cors";
import expressFileUpload from "express-fileupload";

const app: Express = express();
const router = new RouterConfig();

//use middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressFileUpload({ useTempFiles: true, createParentPath: true }));

//use router here
app.use(router.getRouter());

//not found middleware
app.use(notFound);

const port: string | number = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB({} as Request, {} as Response);
		app.listen(port, () => {
			log.info(`Server running on port ${port}...`);
		});
	} catch (error: any) {
		log.info("Unable to start app");
	}
};

start();
