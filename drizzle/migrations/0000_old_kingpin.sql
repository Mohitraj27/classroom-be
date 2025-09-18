CREATE TABLE `content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentUrl` varchar(500),
	`contentType` varchar(50) NOT NULL,
	`embedLink` varchar(500),
	`metadata` json,
	`createdBy` int NOT NULL,
	CONSTRAINT `content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contentAssignment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(20) NOT NULL DEFAULT 'CONTENT',
	`contentId` int,
	`quizId` int,
	`learnerId` int NOT NULL,
	`assignedBy` int NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `contentAssignment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contentProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`learnerId` int NOT NULL,
	`courseId` int NOT NULL,
	`contentId` int NOT NULL,
	`progressPercentage` int DEFAULT 0,
	`courseProgressStatus` varchar(20) DEFAULT 'NOT_STARTED',
	`lastAccessedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`totalMarks` int DEFAULT 0,
	`createdBy` int NOT NULL,
	CONSTRAINT `quizzes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizAnswers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submissionId` int NOT NULL,
	`questionId` int NOT NULL,
	`selectedAnswer` varchar(255),
	`isCorrect` boolean DEFAULT false,
	`marksObtained` int DEFAULT 0,
	CONSTRAINT `quizAnswers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizQuestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quizId` int NOT NULL,
	`questionText` text NOT NULL,
	`options` json NOT NULL,
	`correctAnswer` varchar(255) NOT NULL,
	`marks` int DEFAULT 1,
	CONSTRAINT `quizQuestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quizId` int NOT NULL,
	`learnerId` int NOT NULL,
	`submittedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`totalScore` int DEFAULT 0,
	CONSTRAINT `quizSubmissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `historySignupRequest` (
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
	CONSTRAINT `historySignupRequest_id` PRIMARY KEY(`id`),
	CONSTRAINT `historySignupRequest_email_unique` UNIQUE(`email`),
	CONSTRAINT `historySignupRequest_userName_unique` UNIQUE(`userName`)
);
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(40) NOT NULL,
	`lastName` varchar(80),
	`email` varchar(320) NOT NULL,
	`userName` varchar(32) NOT NULL,
	`password` varchar(60) NOT NULL,
	`contact_number` varchar(10) NOT NULL,
	`country` varchar(90) NOT NULL,
	`city` varchar(35) NOT NULL,
	`resetToken` varchar(64),
	`role` varchar(20) NOT NULL DEFAULT 'learner',
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_userName_unique` UNIQUE(`userName`)
);
