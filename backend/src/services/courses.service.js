const courseRepository = require('../repositories/courses.repository');
const AppError = require('../utils/AppError');
const { validateCourse, updateCourseValidation } = require('../validators/course.validator');

//  create, view, update, and delete courses. 

const createCourse = async (courseData) => {
    const errors = validateCourse(courseData);
    if (Object.keys(errors).length > 0) {
        throw new AppError(errors, 400);
    }
    return await courseRepository.create(courseData);
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
    return updatedCourse;
};

const deleteCourse = async (id) => {
    const course_id = Number(id);
    if (!Number.isInteger(course_id) || course_id <= 0) {
        throw new AppError("Invalid course ID", 400);
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
