CREATE TABLE `content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`unitId` int NOT NULL,
	`contentUrl` varchar(500),
	`embedLink` varchar(500),
	`metadata` json,
	`createdBy` int NOT NULL,
	CONSTRAINT `content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contentAssignment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentId` int NOT NULL,
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
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`createdBy` int NOT NULL,
	`difficulty` varchar(50) NOT NULL,
	`tags` text,
	`courseStatus` varchar(20) NOT NULL DEFAULT 'DRAFT',
	`isPublished` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`unitId` int NOT NULL,
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
CREATE TABLE `units` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`contentType` varchar(20) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `units_id` PRIMARY KEY(`id`)
);
