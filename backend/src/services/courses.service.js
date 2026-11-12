const courseRepository = require('../repositories/courses.repository');
const notificationService = require('./notification.service');
const AppError = require('../utils/AppError');
const { validateCourse, updateCourseValidation } = require('../validators/course.validator');

//  create, view, update, and delete courses. 

const createCourse = async (courseData) => {
    const errors = validateCourse(courseData);
    if (Object.keys(errors).length > 0) {
        throw new AppError(errors, 400);
    }

    const newCourse = await courseRepository.create(courseData);

    try {
        await notificationService.notifyAllStudents({
            title: "New Course Available",
            message: `A new course '${newCourse.course_name}' (${newCourse.course_code}) is now open for enrollment. Check it out!`,
            type: "course"
        });
    } catch (err) {
        console.error("Notification error:", err.message);
    }

    return newCourse;
};

const getAllCourses = async () => {
    return await courseRepository.findAll();
};

const getCourseById = async (id) => {
    const course_id = Number(id);
    if (!Number.isInteger(course_id) || course_id <= 0) {
        throw new AppError("Invalid course ID", 400);
    }
    const course = await courseRepository.findById(course_id);
    if (!course) {
        throw new AppError("Course Not Found", 404);
    }
    return course;
};

const updateCourse = async (id, courseData) => {
    const course_id = Number(id);
    if (!Number.isInteger(course_id) || course_id <= 0) {
        throw new AppError("Invalid course ID", 400);
    }
    const errors = updateCourseValidation(courseData);
    if (Object.keys(errors).length > 0) {
        throw new AppError(errors, 400);
    }
    const updatedCourse = await courseRepository.update(course_id, courseData);
    if (!updatedCourse) {
        throw new AppError("Course Not Found", 404);
    }

    try {
        await notificationService.notifyCourseStudents(course_id, {
            title: "Course Updated",
            message: `${updatedCourse.course_name} (${updatedCourse.course_code}) details have been updated`,
            type: "course"
        });
    } catch (err) {
        console.error("Notification error:", err.message);
    }

    return updatedCourse;
};

const deleteCourse = async (id) => {
    const course_id = Number(id);
    if (!Number.isInteger(course_id) || course_id <= 0) {
        throw new AppError("Invalid course ID", 400);
    }   

    const course = await courseRepository.findById(course_id);
    if (!course) {
        throw new AppError("Course Not Found", 404);
    }

    try {
        await notificationService.notifyCourseStudents(course_id, {
            title: "Course Deleted",
            message: `The course '${course.course_name}' (${course.course_code}) has been removed`,
            type: "course"
        });
    } catch (err) {
        console.error("Notification error:", err.message);
    }

    const deleted = await courseRepository.deleteById(course_id);
    if (!deleted) {
        throw new AppError("Course Not Found", 404);
    }
    return { message: "Course deleted successfully" };
};

module.exports = {
    createCourse,
    getAllCourses,  
    getCourseById,
    updateCourse,
    deleteCourse
};
