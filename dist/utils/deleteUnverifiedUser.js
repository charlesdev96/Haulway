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
exports.userCreatedEmitter = exports.deleteUnverifiedUsers = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const events_1 = require("events");
const utils_1 = require("../utils");
const model_1 = require("../model");
// Function to delete unverified users created more than 25 minutes ago
const deleteUnverifiedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Calculate the time 20 minutes ago
        const thirtyMinutesAgo = new Date(Date.now() - 25 * 60 * 1000);
        // Find unverified users created more than 25 minutes ago
        const unverifiedUsers = yield model_1.UserModel.find({
            verified: false,
            createdAt: { $lt: thirtyMinutesAgo },
        });
        // Delete each unverified user
        for (const user of unverifiedUsers) {
            yield user.deleteOne();
            utils_1.log.info(`User ${user._id} and full-name: ${user.fullName} deleted.`);
        }
        utils_1.log.info("All unverified users deleted successfully.");
    }
    catch (error) {
        utils_1.log.info("Error deleting unverified users:", error);
    }
});
exports.deleteUnverifiedUsers = deleteUnverifiedUsers;
// Schedule the function to run periodically (e.g., every minute)
node_cron_1.default.schedule("*/3 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    utils_1.log.info("Running deleteUnverifiedUsers task...");
    yield (0, exports.deleteUnverifiedUsers)();
}));
// Listener for user creation event
exports.userCreatedEmitter = new events_1.EventEmitter();
// Assuming you have an event emitter for user creation events called 'userCreatedEmitter'
exports.userCreatedEmitter.on("userCreated", (user) => __awaiter(void 0, void 0, void 0, function* () {
    // Set up a timer to check the verification status after 20 minutes
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        // Check if the user is still unverified after 20 minutes
        const userRecord = yield model_1.UserModel.findById(user._id);
        if (userRecord && !userRecord.verified) {
            // If unverified, delete the user
            yield userRecord.deleteOne();
            utils_1.log.info(`User userId: ${user._id} and full-name: ${user.fullName} deleted due to lack of verification.`);
        }
    }), 25 * 60 * 1000); // 20 minutes
}));
