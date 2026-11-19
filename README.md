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
- Recharts
- Socket.IO Client

### Backend
- Node.js
- Express.js
- PostgreSQL
- node-postgres (`pg`)
- Socket.IO
- JSON Web Token (`jsonwebtoken`)
- bcryptjs

## Features
- Role-Based Authentication & Authorization (JWT authentication for Admin & Student roles, profile management)
- Student Information Management (CRUD - Create, Read, Update, Delete, enrollment status & course filtering, unenrolled student lookup)
- Course Management (CRUD - Course codes, credit limits, seat capacities, live seat availability, descriptions)
- Enrollment System (Assign students to courses with duplicate prevention and course capacity enforcement)
- Enrollment Drop Policy (Enforces 24-hour drop window from enrollment time for students; Admins can drop anytime)
- Real-Time Notifications & Announcements (Socket.IO push notifications, unread tracking, mark as read/delete, Admin broadcasts to all students or course enrollees)
- Reports & Analytics (KPIs, top courses, monthly registration vs enrollment history, filterable detailed roster, CSV export)
- Student & Course Activity Logs (Audit logging for admin actions on students, courses, and student enrollments/course withdrawals with date, user, activity-type filtering and pagination)
- Dashboard Metrics & Analytics (Admin dashboard with Recharts visualizations; Student dashboard with enrolled courses, credits & campus announcements)
- Light & Dark Mode Support (Persistent theme switcher across the application)
- Centralized Error Handling & PostgreSQL validation (Duplicate record `23505`, Foreign key `23503`)
- Layered 3-Tier Architecture (Controller -> Service -> Repository)
- REST API for frontend-backend communication
- PostgreSQL database integration with connection pooling (`pg` Pool)

## Entity
- User
    - Admin
    - Student
- Courses
- Enrollments
- Notifications
- Activity Logs

## Project Structure
student-management-system/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   └── notifications/
│   │   ├── config/
│   │   ├── features/
│   │   │   ├── courses/
│   │   │   ├── enrollments/
│   │   │   ├── reports/
│   │   │   └── students/
│   │   ├── pages/
│   │   │   └── auth/
│   │   ├── context/
│   │   ├── routes/
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
| CLIENT_URL | Frontend origin URL for Socket.IO CORS (e.g., http://localhost:5173) |
| JWT_SECRET | Secret key for JWT signing |
| JWT_EXPIRES_IN | JWT token expiration duration (e.g., 5d) |
| VITE_API_BASE_URL | Frontend API base URL (e.g., http://localhost:5000/api) |
| VITE_SOCKET_URL | Frontend Socket.IO server URL (e.g., http://localhost:5000) |



## Database Design
- The application uses a relational database with five main tables

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
    - user_id - Foreign key referencing users(id) ON DELETE SET NULL
    - created_at
    - updated_at

### Courses
- Stores course information, including its unique identifier and seat capacity
    - id - primary key
    - course_code (Unique)
    - course_name
    - description
    - credits
    - capacity (Default 30, CHECK capacity > 0)
    - created_at
    - updated_at


### Enrollments
- Connects students and courses using foreign keys
    - id - primary key
    - student_id - Foreign key referencing the students table (ON DELETE CASCADE)
    - course_id - Foreign key referencing the courses table (ON DELETE CASCADE)
    - enrollment_date


### Notifications
- Stores user notifications and admin broadcast announcements
    - id - primary key
    - user_id - Foreign key referencing users(id) (ON DELETE CASCADE)
    - title
    - message
    - type
    - is_read (Default false)
    - created_at


### Activity Logs
- Stores audit logs for student, course, and enrollment actions
    - id - primary key
    - user_id - Foreign key referencing users(id) (ON DELETE SET NULL)
    - action - Type of action performed (e.g., STUDENT_CREATE, COURSE_UPDATE, ENROLLMENT_DROP)
    - entity_type - Target entity ('student', 'course', 'enrollment')
    - entity_id - ID of the target entity
    - description - Detailed summary of the performed action
    - created_at


### Relationships
- One Student can have multiple enrollments
- One course can have multiple enrollments
- Students and courses have a many-to-many relationship through the enrollments table
- A unique constraint on (student_id, course_id) prevents duplicate enrollments.
- One User can have multiple notifications (deleted automatically when the user is deleted)
- One User can have multiple activity logs (logs are preserved with null user_id if the user is deleted)



# API Testing
- Base URL: http://localhost:5000

## Health 
    - Method: GET
    - URL: http://localhost:5000/api/health
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

### View Current User Alias
    - Method: GET
    - URL: http://localhost:5000/api/auth/me
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

### GET Not Enrolled Students
    - Method: GET
    - URL: http://localhost:5000/api/students/not_enrolled
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
            "credits": 4,
            "capacity": 30
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
            "credits": 4,
            "capacity": 40
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

### Get All Enrollments (Student views own; Admin views all or filters by ?student_id=:id)
    - Method: GET
    - URL: http://localhost:5000/api/enrollment
    - Headers: Authorization: Bearer <TOKEN>
    - Body (raw JSON): None

### Drop Enrollment (Student within 24hr of own; Admin anytime)
    - Method: DELETE
    - URL: http://localhost:5000/api/enrollment/:id
    - Headers: Authorization: Bearer <TOKEN>
    - Body (raw JSON): None



## DASHBOARD API (Admin Only)
### Dashboard stats
    - Method: GET
    - URL: http://localhost:5000/api/dashboard/stats
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): None

### Dashboard Enrollments
    - Method: GET
    - URL: http://localhost:5000/api/dashboard/enrollments
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): None

### Dashboard Students
    - Method: GET
    - URL: http://localhost:5000/api/dashboard/students
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): None

### Dashboard Courses
    - Method: GET
    - URL: http://localhost:5000/api/dashboard/courses
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): None



## NOTIFICATIONS API
### Get User Notifications (Optional ?unreadOnly=true)
    - Method: GET
    - URL: http://localhost:5000/api/notifications
    - Headers: Authorization: Bearer <TOKEN>
    - Body (raw JSON): None

### Get Unread Notification Count
    - Method: GET
    - URL: http://localhost:5000/api/notifications/unread-count
    - Headers: Authorization: Bearer <TOKEN>
    - Body (raw JSON): None

### Mark Notification As Read
    - Method: PATCH
    - URL: http://localhost:5000/api/notifications/:id/read
    - Headers: Authorization: Bearer <TOKEN>
    - Body (raw JSON): None

### Mark All Notifications As Read
    - Method: PATCH
    - URL: http://localhost:5000/api/notifications/read-all
    - Headers: Authorization: Bearer <TOKEN>
    - Body (raw JSON): None

### Delete Notification
    - Method: DELETE
    - URL: http://localhost:5000/api/notifications/:id
    - Headers: Authorization: Bearer <TOKEN>
    - Body (raw JSON): None

### Broadcast Announcement (Admin Only - omit courseId for all students)
    - Method: POST
    - URL: http://localhost:5000/api/notifications/announcement
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): {
            "title": "[EXAM] Midterm Schedule",
            "message": "Midterm exams begin next Monday.",
            "courseId": 1
        }



## REPORTS API (Admin Only)
### Get Analytics Overview (KPIs, Course Enrollment Breakdown & Monthly History)
    - Method: GET
    - URL: http://localhost:5000/api/reports/analytics
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): None

### Get Detailed Enrollment Roster (Optional ?courseId=&startDate=&endDate=)
    - Method: GET
    - URL: http://localhost:5000/api/reports/roster
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): None

### Export Enrollment Roster as CSV (Optional ?courseId=&startDate=&endDate=)
    - Method: GET
    - URL: http://localhost:5000/api/reports/export/csv
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): None


## Activity Logs API (Admin Only)
### Get Activity Logs (With Pagination & Filters)
    - Method: GET
    - URL: http://localhost:5000/api/activity-logs?page=1&limit=10&action=&userId=&startDate=&endDate=
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): None

### Get Activity Log Filter Options (Distinct Users & Actions)
    - Method: GET
    - URL: http://localhost:5000/api/activity-logs/filters
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
    - Body (raw JSON): None

### Get Activity Log By ID
    - Method: GET
    - URL: http://localhost:5000/api/activity-logs/:id
    - Headers: Authorization: Bearer <ADMIN_TOKEN>
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
            user_id INT UNIQUE REFERENCES users(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE courses (
            id SERIAL PRIMARY KEY,
            course_code VARCHAR(20) UNIQUE NOT NULL,
            course_name VARCHAR(100) NOT NULL,
            description TEXT,
            credits INT NOT NULL DEFAULT 3,
            capacity INT NOT NULL DEFAULT 30 CHECK (capacity > 0),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE enrollments (
            id SERIAL PRIMARY KEY,
            student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
            course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
            enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT unique_student_course UNIQUE (student_id, course_id)
        );

        CREATE TABLE notifications (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(50) NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE activity_logs (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE SET NULL,
            action VARCHAR(50) NOT NULL,
            entity_type VARCHAR(30) NOT NULL,
            entity_id INT,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        VITE_SOCKET_URL=http://localhost:5000
    - Start the frontend development server:
        npm run dev

5. Access the application
    - Backend API: http://localhost:5000
    - Frontend App: http://localhost:5173

