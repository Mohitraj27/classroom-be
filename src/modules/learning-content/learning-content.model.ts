import { mysqlTable, int, varchar, text, boolean, timestamp, json } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

// === 4. Learning Content ===
export const content = mysqlTable('content', {
  id: int('id').primaryKey().autoincrement(),
  moduleId: int('moduleId'), // FK from unit
  contentUrl: varchar('contentUrl', { length: 500 }), // For video / PDF / PPT files
  contentType: varchar('contentType', { length: 50 }).notNull(), // video / pdf / ppt
  embedLink: varchar('embedLink', { length: 500 }), // For embedded videos
  metadata: json('metadata'), // Optional extra details
  createdBy: int('createdBy').notNull(), // FK from users (tutor/admin)
});

// === 5. Quiz ===
export const quiz = mysqlTable('quizzes', {
  id: int('id').primaryKey().autoincrement(),
  moduleId: int('moduleId'), // FK from unit
  title: varchar('title', { length: 255 }).notNull(),
  totalMarks: int('totalMarks').default(0),
  createdBy: int('createdBy').notNull(),
});

// === 6. Quiz Questions ===
export const quizQuestion = mysqlTable('quizQuestions', {
  id: int('id').primaryKey().autoincrement(),
  quizId: int('quizId').notNull(), // FK from quiz
  questionText: text('questionText').notNull(),
  options: json('options').notNull(), // ["Option A", "Option B", "Option C"]
  correctAnswer: varchar('correctAnswer', { length: 255 }).notNull(), // match with one of the options
  marks: int('marks').default(1),
});

// === 7. Learner Assigned Content ===
export const contentAssignment = mysqlTable('contentAssignment', {
  id: int('id').primaryKey().autoincrement(),
  type: varchar('type', { length: 20 }).notNull().default('CONTENT'), 
  contentId: int('contentId'), // FK from content
  quizId: int('quizId'), // FK from quizzes
  learnerId: int('learnerId').notNull(), // FK from users
  assignedBy: int('assignedBy').notNull(), // tutor/admin
  assignedAt: timestamp('assignedAt').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// === 8. Learner Quiz Submissions ===
export const quizSubmission = mysqlTable('quizSubmissions', {
  id: int('id').primaryKey().autoincrement(),
  quizId: int('quizId').notNull(),
  learnerId: int('learnerId').notNull(),
  submittedAt: timestamp('submittedAt').default(sql`CURRENT_TIMESTAMP`).notNull(),
  totalScore: int('totalScore').default(0),
});

// === 9. Learner Quiz Answers ===
export const quizAnswer = mysqlTable('quizAnswers', {
  id: int('id').primaryKey().autoincrement(),
  submissionId: int('submissionId').notNull(),
  questionId: int('questionId').notNull(),
  selectedAnswer: varchar('selectedAnswer', { length: 255 }),
  isCorrect: boolean('isCorrect').default(false),
  marksObtained: int('marksObtained').default(0),
});
 
// === 10. Content Progress Tracking ===
export const contentProgress = mysqlTable("contentProgress", {
  id: int("id").primaryKey().autoincrement(),
  learnerId: int("learnerId").notNull(),          // FK to users
  courseId: int("courseId").notNull(),            // FK to courses
  contentId: int("contentId").notNull(),          // FK to content/unit
  progressPercentage: int("progressPercentage").default(0),  // 0 to 100
  courseProgressStatus: varchar("courseProgressStatus", { length: 20 }).default("NOT_STARTED"), // NOT_STARTED, IN_PROGRESS, COMPLETED
  lastAccessedAt: timestamp("lastAccessedAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
});
