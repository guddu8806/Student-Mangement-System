# Student Management System
This is a full stack student management system designed to organize and manage student information through a simple and user-friendly interface.

# Overview
This project is being developed using React for the frontend, Node.js and Express.js for the backend, and PostgreSQL for the database management.

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router
- Lucide React

### Backend
- Node.js
- Express.js
- PostgreSQL
- node-postgres (`pg`)

## Features
- Student Information Management (CRUD - Create, Read, Update, Delete)
- Course Management (CRUD - Course codes, credit limits, descriptions)
- Enrollment System (Assign students to courses with duplicate prevention)
- Enrollment Drop Policy (Enforces 24-hour drop window from enrollment time)
- Dashboard Metrics & Analytics (Total students, active courses, recent registrations)
- Centralized Error Handling & PostgreSQL validation (Duplicate record `23505`, Foreign key `23503`)
- Layered 3-Tier Architecture (Controller -> Service -> Repository)
- REST API for frontend-backend communication
- PostgreSQL database integration with connection pooling (`pg` Pool)

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
│   │   ├── app/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   
│   │   ├── features/
│   │   │   ├── courses/
│   │   │   ├── enrollments/
│   │   │   └── students/
│   │   ├
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
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
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md


## Prerequisites

- Node.js (v18+) and npm
- PostgreSQL
- Git & GitHub



## Environment Variables

| Variable | Description |
| --- | --- |
| DB_HOST | PostgreSQL host |
| DB_PORT | PostgreSQL port |
| DB_NAME | Database name |
| DB_USER | Database username |
| DB_PASSWORD | Database password |
| PORT | Backend server port |
| JWT_SECRET | Secret key for JWT signing |
| JWT_EXPIRES_IN | JWT token expiration duration (e.g., 5d) |



## Database Design
- The application uses a relational database with four main tables

### Users
- Stores user credentials and authentication roles
    - id - Primary key
    - name
    - email (Unique)
    - password_hash
    - role ('admin' or 'student')
    - created_at
    - updated_at

### Students
- Stores student information
    - id - Primary key 
    - first_name
    - last_name
    - email (Unique)
    - phone
    - user_id - Foreign key referencing users(id) ON DELETE CASCADE
    - created_at
    - updated_at

### Courses
- Stores course information, including its unique identifier
    - id - primary key
    - course_code (Unique)
    - course_name
    - description
    - credits
    - created_at
    - updated_at


### Enrollments
- Connects students and courses using foreign keys
    - id - primary key
    - student_id - Foreign key referencing the students table
    - course_id - Foreign key referencing the courses table
    - enrollment_date
    - status


### Relationships
- One Student can have multiple enrollments
- One course can have multiple enrollments
- Students and courses have a many-to-many relationship through the enrollments table
- A unique constraint on (student_id, course_id) prevents duplicate enrollments.



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

## Authentication API
### Register User (Student)
    - Method: POST
    - URL: http://localhost:5000/api/auth/register
    - Body (raw JSON): {
            "name": "Rahul Sharma",
            "email": "rahul.sharma@example.com",
            "password": "password123",
            "phone": "+919876543210",
            "role": "student"
        }

### Register User (Admin)
    - Method: POST
    - URL: http://localhost:5000/api/auth/register
    - Body (raw JSON): {
            "name": "Super Admin",
            "email": "admin@educore.com",
            "password": "adminpassword123",
            "role": "admin"
        }

### Login User
    - Method: POST
    - URL: http://localhost:5000/api/auth/login
    - Body (raw JSON): {
            "email": "rahul.sharma@example.com",
            "password": "password123"
        }

### View Profile
    - Method: GET
    - URL: http://localhost:5000/api/auth/profile
    - Headers: Authorization: Bearer <TOKEN>
    - Body (raw JSON): None

### Update Profile
    - Method: PUT
    - URL: http://localhost:5000/api/auth/profile
    - Headers: Authorization: Bearer <TOKEN>
    - Body (raw JSON): {
            "name": "Rahul Kumar Sharma",
            "phone": "+919876549999"
        }

### Delete Profile (Self)
    - Method: DELETE
    - URL: http://localhost:5000/api/auth/profile
    - Headers: Authorization: Bearer <TOKEN>
    - Body (raw JSON): None

### Delete User By ID (Admin Only)
    - Method: DELETE
    - URL: http://localhost:5000/api/auth/users/:id
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): None



## Students API (Admin Only)
### Create Student
    - Method: POST
    - URL: http://localhost:5000/api/students
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): {
            "first_name": "Aman",
            "last_name": "Verma",
            "email": "aman.verma@example.com",
            "phone": "+919876543211"
        }

### GET Student By ID
    - Method: GET
    - URL: http://localhost:5000/api/students/:id
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): None

### GET All Students
    - Method: GET
    - URL: http://localhost:5000/api/students
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): None

### UPDATE Student
    - Method: PUT
    - URL: http://localhost:5000/api/students/:id
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): {
            "first_name": "Aman",
            "last_name": "Kumar",
            "phone": "+919876540000"
        }

### Delete Student
    - Method: DELETE
    - URL: http://localhost:5000/api/students/:id
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): None



## COURSE API
### Create Course (Admin Only)
    - Method: POST
    - URL: http://localhost:5000/api/courses
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): {
            "course_name": "Data Structures & Algorithms",
            "course_code": "CS201",
            "description": "Core computer science course covering trees, graphs, and sorting.",
            "credits": 4
        }

### Get Course By ID (Admin & Student)
    - Method: GET
    - URL: http://localhost:5000/api/courses/:id
    - Headers: Authorization: Bearer <TOKEN>
    - Body (raw JSON): None

### Get All Courses (Admin & Student)
    - Method: GET
    - URL: http://localhost:5000/api/courses
    - Headers: Authorization: Bearer <TOKEN>
    - Body (raw JSON): None

### Update Course (Admin Only)
    - Method: PUT
    - URL: http://localhost:5000/api/courses/:id
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): {
            "course_name": "Advanced Data Structures & Algorithms",
            "credits": 4
        }

### Delete Course (Admin Only)
    - Method: DELETE
    - URL: http://localhost:5000/api/courses/:id
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): None



## ENROLLMENT API
### Create Enrollment (Student Self-Enroll)
    - Method: POST
    - URL: http://localhost:5000/api/enrollment
    - Headers: Authorization: Bearer <STUDENT_TOKEN>
    - Body (raw JSON): {
            "course_id": 1
        }

### Create Enrollment (Admin Manual Enroll)
    - Method: POST
    - URL: http://localhost:5000/api/enrollment
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): {
            "student_id": 1,
            "course_id": 1
        }

### Get All Enrollments (Student views own; Admin views all)
    - Method: GET
    - URL: http://localhost:5000/api/enrollment
    - Headers: Authorization: Bearer <TOKEN>
    - Body (raw JSON): None

### Drop Enrollment (Student within 24hr of own; Admin anytime)
    - Method: DELETE
    - URL: http://localhost:5000/api/enrollment/:id
    - Headers: Authorization: Bearer <TOKEN>
    - Body (raw JSON): None



## DASHBOARD API
### Dashboard stats
    - Method: GET
    - URL: http://localhost:5000/api/dashboard/stats
    - Body (raw JSON): None

### Dashboard Enrollments
    - Method: GET
    - URL: http://localhost:5000/api/dashboard/enrollments
    - Body (raw JSON): None

### Dashboard Students
    - Method: GET
    - URL: http://localhost:5000/api/dashboard/students
    - Body (raw JSON): None

### Dashboard Courses
    - Method: GET
    - URL: http://localhost:5000/api/dashboard/courses
    - Body (raw JSON): None




# Installation
1. Clone the repository
    - git clone https://github.com/guddu8806/Student-Mangement-System.git
    - cd student-management-system

2. Configure the database
    - Create a PostgreSQL database for the application:
        CREATE DATABASE educore;
    - Run the database schema or SQL queries to create the required tables:
        ```sql
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE students (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            phone VARCHAR(20),
            user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE courses (
            id SERIAL PRIMARY KEY,
            course_code VARCHAR(20) UNIQUE NOT NULL,
            course_name VARCHAR(100) NOT NULL,
            description TEXT,
            credits INT NOT NULL DEFAULT 3,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE enrollments (
            id SERIAL PRIMARY KEY,
            student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
            course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
            enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(20) DEFAULT 'enrolled',
            CONSTRAINT unique_student_course UNIQUE (student_id, course_id)
        );
        ```

3. Configure the backend
    - cd backend
    - npm install
    - Create a .env file and add all the environment variables:
        PORT=5000
        CLIENT_URL=http://localhost:5173
        DB_HOST=localhost
        DB_PORT=5433
        DB_NAME=educore
        DB_USER=postgres
        DB_PASSWORD=********** (YOUR DB PASSWORD)
        JWT_SECRET=your_jwt_secret_key_here
        JWT_EXPIRES_IN=5d
    - Start the backend server:
        npm run dev

4. Configure the frontend
    - cd ../frontend
    - npm install
    - Create a .env file:
        VITE_API_BASE_URL=http://localhost:5000/api
    - Start the frontend development server:
        npm run dev

5. Access the application
    - Backend API: http://localhost:5000
    - Frontend App: http://localhost:5173

