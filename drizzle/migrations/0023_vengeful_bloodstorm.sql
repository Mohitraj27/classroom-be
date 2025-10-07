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
