CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	`email` varchar(256) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
