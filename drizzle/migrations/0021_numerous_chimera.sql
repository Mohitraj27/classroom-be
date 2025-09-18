CREATE TABLE `learnerAssignment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(20) NOT NULL DEFAULT 'CONTENT',
	`contentId` int,
	`quizId` int,
	`learnerId` int NOT NULL,
	`assignedBy` int NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `learnerAssignment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `contentAssignment`;