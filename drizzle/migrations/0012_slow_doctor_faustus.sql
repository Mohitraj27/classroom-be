ALTER TABLE `users` DROP INDEX `UserName already exist`;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_userName_unique` UNIQUE(`userName`);