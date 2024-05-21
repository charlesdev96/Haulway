import { config } from "dotenv";
config();
import express, { Request, Response, Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
	connectDB,
	log,
	userCreatedEmitter,
	deleteUnverifiedUsers,
} from "./utils";
import { setupSocket } from "./server";
import { notFound } from "./middleware";
import RouterConfig from "./routes/routes";
import helmet from "helmet";
import cors from "cors";
import expressFileUpload from "express-fileupload";

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*", // Replace with your frontend URL
		methods: ["GET", "POST", "PATCH", "DELETE"],
	},
});
setupSocket(io);
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
		await deleteUnverifiedUsers();
		await userCreatedEmitter;
		server.listen(port, () => {
			log.info(`Server running on port ${port}...`);
		});
	} catch (error: any) {
		log.info("Unable to start app");
	}
};

start();
