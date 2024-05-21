import { Server } from "socket.io";
import {
	UserModel,
	PostModel,
	ReplyModel,
	CommentModel,
	StoreModel,
} from "./model";

import { log } from "./utils";

export const setupSocket = (io: Server) => {
	io.on("connection", (socket) => {
		log.info("A user is connected");
		log.info(socket.id);
	});
	io.on("disconnect", () => {
		log.info("A user is connected");
	});
};
