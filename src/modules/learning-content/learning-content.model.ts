import { mysqlTable, int, varchar, text, boolean, timestamp, json } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { user } from '../user/user.model';

// === 4. Learning Content ===
export const content = mysqlTable('content', {
  id: int('id').primaryKey().autoincrement(),
  contentUrl: varchar('contentUrl', { length: 500 }),
  contentType: varchar('contentType', { length: 50 }).notNull(),
  embedLink: varchar('embedLink', { length: 500 }),
  metadata: json('metadata'),
  createdBy: int('createdBy').notNull().references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
});

// === 5. Quiz ===
export const quiz = mysqlTable('quizzes', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  totalMarks: int('totalMarks').default(0),
  createdBy: int('createdBy').notNull().references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
});

// === 6. Quiz Questions ===
export const quizQuestion = mysqlTable('quizQuestions', {
  id: int('id').primaryKey().autoincrement(),
  quizId: int('quizId').notNull().references(() => quiz.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  questionText: text('questionText').notNull(),
  options: json('options').notNull(),
  correctAnswer: varchar('correctAnswer', { length: 255 }).notNull(),
  marks: int('marks').default(1),
});

// === 7. Learner Assigned Content ===
export const learnerAssignment = mysqlTable('learnerAssignment', {
  id: int('id').primaryKey().autoincrement(),
  type: varchar('type', { length: 20 }).notNull().default('CONTENT'),
  contentId: int('contentId').references(() => content.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  quizId: int('quizId').references(() => quiz.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  learnerId: int('learnerId').notNull().references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  assignedBy: int('assignedBy').notNull().references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  assignedAt: timestamp('assignedAt').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// === 8. Learner Quiz Submissions ===
export const quizSubmission = mysqlTable('quizSubmissions', {
  id: int('id').primaryKey().autoincrement(),
  quizId: int('quizId').notNull().references(() => quiz.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  learnerId: int('learnerId').notNull().references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  submittedAt: timestamp('submittedAt').default(sql`CURRENT_TIMESTAMP`).notNull(),
  totalScore: int('totalScore').default(0),
});

// === 9. Learner Quiz Answers ===
export const quizAnswer = mysqlTable('quizAnswers', {
  id: int('id').primaryKey().autoincrement(),
  submissionId: int('submissionId').notNull().references(() => quizSubmission.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  questionId: int('questionId').notNull().references(() => quizQuestion.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  selectedAnswer: varchar('selectedAnswer', { length: 255 }),
  isCorrect: boolean('isCorrect').default(false),
  marksObtained: int('marksObtained').default(0),
});
