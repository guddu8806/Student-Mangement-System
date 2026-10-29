# Student Management System
THis is full stack student management system designed to organize and maage student information through a simple and user-friendly interface.

# Overview
This project is beign developed using React for the frontend , Node.js and Express.js for the backend , and PostgreSQL for the database management.

## Tech Stack

### Frontend
- React Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- PostgreSQL
- node-postgres (`pg`)

## Features
- Student Information management
- Store and retrieve student details
- REST API for frontend-backend communication
- PostgreSQL database integration

more features will be added soon.


## Entity
- User
    - Admin
    - Mentor
    - Student
- Courses
- Enrollments

## Project Structure
student-management-system/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md


## Prerequisites

- Node.js and npm
- PostgreSQL
- Git



## Environment Variables

| Variable | Description |
| DB_HOST | PostgreSQL host |
| DB_PORT | PostgreSQL port |
| DB_NAME | Database name |
| DB_USER | Database username |
| DB_PASSWORD | Database password |
| PORT | Backend server port |



## Database Design
- The application uses a relational databse with three main tables

### Students
- Stores student information
    - id - Primary key 
    - first_name
    - last_name
    - email
    - phone
    - created_at
    - updated_at

### Courses
- Stores course information, including it's unique identifier
    - id - primary key
    - course_code
    - course_name
    - description
    - credits
    - created_at
    - updated_at


### Enrollments
- This will connect the students and courses using the foreign key and referces of the tables
    - id - primary key
    - student_id - Foriegn key referencing the students table
    - course_id - Foreign key referencing thecourses table
    - enrollment_date
    - status


### Relationships
- One Student can have multiple enrollments
- One courses can have multiple enrollments
- Students and courses have a many-to-many relationship through the enrollments table
- A unique constraint on (student_id , course_id ) prevents duplicate enrollments.



## Prerequisites
- Node.js and npm
- PostgreSQL
- Git & GitHub
- React.js
- Tailwind


# API Testing
- Base URL: http://localhost:5000
## Health 
    - Method: GET
    - URL: http://localhost:5000/api/health
    - Body: None

## DB Health
    - Method: GET
    - URL: http://localhost:5000/api/db-health
    - Body: None

## Students API
### Create Student
    - Method: POST
    - URL: http://localhost:5000/api/students
    - Body (raw JSON): {
            "first_name": "abc",
            "last_name": "xyz",
            "email": "abc@gmail.com",
            "phone": "+919876543210"
        }
### GET Student By ID
    - Method: GET
    - URL: http://localhost:5000/api/students/id
    - Body (raw JSON):NONE

### GET Student
    - Method: GET
    - URL: http://localhost:5000/api/students
    - Body (raw JSON):NONE

### UPDATE Student
    - Method: PUT
    - URL: http://localhost:5000/api/students/id
    - Body (raw JSON): {
            "first_name": "abc",
            "last_name": "xyz",
            "email": "abc@gmail.com",
            "phone": "+919876543210"
        }
### Delete Student
    - Method: DEL
    - URL: http://localhost:5000/api/students/id
    - Body (raw JSON): None



## COURSE API
### Create COurse
    - Method: POST
    - URL: http://localhost:5000/api/courses
    - Body (raw JSON): {
            "course_name": "Data Structures & Algorithms",
            "course_code": "CS201",
            "description": "Core computer science course covering trees, graphs, and sorting.",
            "credits": 4
        }

### Get COurse By ID
    - Method: GET
    - URL: http://localhost:5000/api/courses/id
    - Body (raw JSON): None

### Get Course 
    - Method: GET
    - URL: http://localhost:5000/api/courses
    - Body (raw JSON): None

### Update COurse
    - Method: PUT
    - URL: http://localhost:5000/api/courses/id
    - Body (raw JSON): {
            "course_name": "Data Structures & Algorithms",
            "course_code": "CS201",
            "description": "Core computer science course covering trees, graphs, and sorting.",
            "credits": 4
        }

### Delete COurse
    - Method: DEL
    - URL: http://localhost:5000/api/courses/id
    - Body (raw JSON): None





# Installation
1. Clone the repository

2. Configure the database
 Create a postgreSQL database for the application
 CREATE DATABASE student_management_system;
    run the project database schema or migration scripts to create the requiured tables


3. Configure the backend
- cd backend
    - npm install
    create .env file and add all the environment variable

