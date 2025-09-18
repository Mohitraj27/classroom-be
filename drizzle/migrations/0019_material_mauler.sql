ALTER TABLE `contentAssignment` MODIFY COLUMN `contentId` int;--> statement-breakpoint
ALTER TABLE `contentAssignment` ADD `type` varchar(20) DEFAULT 'CONTENT' NOT NULL;--> statement-breakpoint
ALTER TABLE `contentAssignment` ADD `quizId` int;