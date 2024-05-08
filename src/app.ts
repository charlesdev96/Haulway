import { config } from "dotenv";
config();
import express, { Request, Response, Express } from "express";
import { connectDB, log } from "./utils";
import { notFound } from "./middleware";
import RouterConfig from "./routes/routes";

const app: Express = express();
const router = new RouterConfig();

//use middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
