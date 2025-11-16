CREATE TABLE `feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`giverId` int NOT NULL,
	`receiverId` int NOT NULL,
	`feedbackText` text NOT NULL,
	`rating` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_giverId_users_id_fk` FOREIGN KEY (`giverId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_receiverId_users_id_fk` FOREIGN KEY (`receiverId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `historySignupRequest` DROP COLUMN `password`;--> statement-breakpoint
ALTER TABLE `signupRequest` DROP COLUMN `password`;