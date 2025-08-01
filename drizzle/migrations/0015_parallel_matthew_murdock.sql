CREATE TABLE `signupRequest` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(40) NOT NULL,
	`lastName` varchar(80),
	`email` varchar(320) NOT NULL,
	`userName` varchar(32) NOT NULL,
	`password` varchar(60) NOT NULL,
	`contact_number` varchar(10) NOT NULL,
	`country` varchar(90) NOT NULL,
	`city` varchar(35) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'PENDING',
	`rejectionReason` varchar(180),
	`role` varchar(20) NOT NULL DEFAULT 'learner',
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `signupRequest_id` PRIMARY KEY(`id`),
	CONSTRAINT `signupRequest_email_unique` UNIQUE(`email`),
	CONSTRAINT `signupRequest_userName_unique` UNIQUE(`userName`)
);
