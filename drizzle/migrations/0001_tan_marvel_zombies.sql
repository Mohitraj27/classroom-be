ALTER TABLE `users` ADD `firstName` varchar(256);--> statement-breakpoint
ALTER TABLE `users` ADD `lastName` varchar(256);--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `confirm_password` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `contact_number` varchar(256);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `name`;