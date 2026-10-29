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
}

const getAllCourses = async (params = {}) => {
    const limit = Number(params.limit) || 10;
    const offset = Number(params.offset) || 0;  
    return await courseRepository.findAll({ limit, offset });
}

const getCourseById = async (id) => {
    const st_id = Number(id);
    if (!Number.isInteger(st_id) || st_id <= 0) {
        throw new AppError("Invalid course ID", 400);
    }
    const course = await courseRepository.findById(st_id);
    if (!course) {
        throw new AppError("Course Not Found", 404);
    }
    return course;
}

const updateCourse = async (id, courseData) => {
    const st_id = Number(id);
    if (!Number.isInteger(st_id) || st_id <= 0) {
        throw new AppError("Invalid course ID", 400);
    }
    const errors = updateCourseValidation(courseData);
    if (Object.keys(errors).length > 0) {
        throw new AppError(errors, 400);
    }
    const updatedCourse = await courseRepository.update(st_id, courseData);
    if (!updatedCourse) {
        throw new AppError("Course Not Found", 404);
    }
    return updatedCourse;
}

const deleteCourse = async (id) => {
    const st_id = Number(id);
    if (!Number.isInteger(st_id) || st_id <= 0) {
        throw new AppError("Invalid course ID", 400);
    }   
    const deleted = await courseRepository.deleteById(st_id);
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