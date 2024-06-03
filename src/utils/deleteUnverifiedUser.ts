import cron from "node-cron";
import { EventEmitter } from "events";
import { log } from "../utils";
import { UserModel } from "../model";

// Function to delete unverified users created more than 25 minutes ago
export const deleteUnverifiedUsers = async () => {
	try {
		// Calculate the time 20 minutes ago
		const thirtyMinutesAgo = new Date(Date.now() - 25 * 60 * 1000);

		// Find unverified users created more than 25 minutes ago
		const unverifiedUsers = await UserModel.find({
			verified: false,
			createdAt: { $lt: thirtyMinutesAgo },
		});

		// Delete each unverified user
		for (const user of unverifiedUsers) {
			await user.deleteOne();
			log.info(`User ${user._id} and full-name: ${user.fullName} deleted.`);
		}

		log.info("All unverified users deleted successfully.");
	} catch (error) {
		log.info("Error deleting unverified users:", error);
	}
};

// Schedule the function to run periodically (e.g., every minute)
cron.schedule("*/3 * * * *", async () => {
	log.info("Running deleteUnverifiedUsers task...");
	await deleteUnverifiedUsers();
});

// Listener for user creation event
export const userCreatedEmitter = new EventEmitter();
// Assuming you have an event emitter for user creation events called 'userCreatedEmitter'
userCreatedEmitter.on("userCreated", async (user) => {
	// Set up a timer to check the verification status after 20 minutes
	setTimeout(
		async () => {
			// Check if the user is still unverified after 20 minutes
			const userRecord = await UserModel.findById(user._id);
			if (userRecord && !userRecord.verified) {
				// If unverified, delete the user
				await userRecord.deleteOne();
				log.info(
					`User userId: ${user._id} and full-name: ${user.fullName} deleted due to lack of verification.`,
				);
			}
		},
		25 * 60 * 1000,
	); // 20 minutes
});
