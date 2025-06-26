ALTER TABLE `users` MODIFY COLUMN `firstName` varchar(100);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `lastName` varchar(100);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `password` varchar(255) NOT NULL;