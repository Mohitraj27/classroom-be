ALTER TABLE `users` MODIFY COLUMN `contact_number` varchar(10);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `confirm_password`;