# sids-classroom-be
This is a Node.js, TypeScript, Drizzle ORM, and MySQL based Learning Management System (LMS) designed for efficient learning and classroom management.

## Features

### User Management

* User registration and login functionality
* User roles (Admin, Tutor, Learner)
* User profile management

### Content Management

* Content creation, update, and deletion
* Content types (Video, PDF, PPT)
* Content metadata management
* Content assignment to learners

### Quiz Management

* Quiz creation, update, and deletion
* Quiz question creation, update, and deletion
* Quiz submission and grading

### Learning Path Management

* Learning paths creation, update, and deletion
* Learning path assignment to learners

## API Endpoints

### User Management

* `POST /signup-request`: Create a new user
* `POST /login`: Login a user
* `GET /getAllUsers`: Get all users
* `GET /getSingleUser/:id`: Get a single user by ID
* `GET /getAllLearners`: Get all learners
* `GET /getAllTutors`: Get all tutors

### Content Management

* `POST /create-content`: Create a new content
* `GET /getContentById/:id`: Get a single content by ID
* `PUT /update-content/:id`: Update a content
* `DELETE /delete-content/:id`: Delete a content
* `GET /getContentByModule/:moduleId`: Get all content by module ID
* `GET /getContentCreatedBy/:createdBy`: Get all content by created by user ID

### Quiz Management

* `POST /create-quiz`: Create a new quiz
* `GET /getQuizById/:id`: Get a single quiz by ID
* `PUT /update-quiz/:id`: Update a quiz
* `DELETE /delete-quiz/:id`: Delete a quiz
* `GET /getAllQuizzes`: Get all quizzes

### Learning Path Management

* `POST /create-learning-path`: Create a new learning path
* `GET /getLearningPathById/:id`: Get a single learning path by ID
* `PUT /update-learning-path/:id`: Update a learning path
* `DELETE /delete-learning-path/:id`: Delete a learning path
