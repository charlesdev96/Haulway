"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const utils_1 = require("./utils");
const setupSocket = (io) => {
    io.on("connection", (socket) => {
        utils_1.log.info("A user is connected");
        utils_1.log.info(socket.id);
    });
    io.on("disconnect", () => {
        utils_1.log.info("A user is connected");
    });
};
exports.setupSocket = setupSocket;
