# sids-classroom-be
This is a Node.js, TypeScript, Drizzle ORM, and MySQL based Learning Management System (LMS) designed for efficient learning and classroom management.

## Features

### Features

* User registration and login functionality
* User roles (Admin, Tutor, Learner)
* User profile management
* User can send a signup request which will be approved by admin
* Signup request approval and rejection by admin
* Content creation, update, and deletion
* Content types (Video, PDF, PPT)
* Content metadata management
* Content assignment to learners
* Quiz creation, update, and deletion
* Quiz question creation, update, and deletion
* Quiz submission and grading
* Learning paths creation, update, and deletion
* Learning path assignment to learners

### Feature Flow

* User Registration and Login:
	+ User registers with email and password
	+ User logs in with email and password
	+ User is validated and logged in
* User Roles:
	+ User is assigned a role (Admin, Tutor, Learner)
	+ User has access to features based on role
* User Profile Management:
	+ User can update their profile information
	+ User can view their profile information
* Signup Request:
	+ User sends a signup request to admin
	+ Admin approves or rejects the signup request
	+ User is notified of the approval or rejection
* Content Management:
	+ Content is created with metadata
	+ Content is updated with new metadata
	+ Content is deleted
	+ Content is assigned to learners
* Quiz Management:
	+ Quiz is created with questions
	+ Quiz is updated with new questions
	+ Quiz is deleted
	+ Quiz is submitted and graded
* Learning Path Management:
	+ Learning path is created with content
	+ Learning path is updated with new content
	+ Learning path is deleted
	+ Learning path is assigned to learners
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
