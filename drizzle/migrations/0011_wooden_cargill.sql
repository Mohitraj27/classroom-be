ALTER TABLE `users` MODIFY COLUMN `password` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `UserName already exist` UNIQUE(`userName`);