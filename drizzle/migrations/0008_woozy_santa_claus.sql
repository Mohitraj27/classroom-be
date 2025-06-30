ALTER TABLE `users` MODIFY COLUMN `firstName` varchar(40) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `lastName` varchar(80);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `password` varchar(16) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `contact_number` varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `userName` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD `country` varchar(90) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `city` varchar(35) NOT NULL;