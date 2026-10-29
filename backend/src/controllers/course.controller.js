const courseService = require("../services/courses.service");
const AppError = require('../utils/AppError');


//create , read, update , delete courses
const createCourse = async(req , res, next) =>{
    try{

        const saved = await courseService.createCourse(req.body);
        res.status(201).json({
            success:true,
            message:"Course created successfully",
            data: saved
        });
    }catch(error){
        next(error);
    }
};

const getAllCourses = async(req, res, next) =>{
    try{
        const params = req.query;
        const courses = await courseService.getAllCourses(params);
        res.status(200).json({
            success:true,
            message: "All courses retreived successfully",
            data: courses
        });
    }catch(error){
        next(error);
    }
};


const getCourseById = async(req, res, next) => {
    try{
        const {id} = req.params;
        const course = await courseService.getCourseById(id);
        res.status(200).json({
            success:true,
            message:"Course retreived successfully",
            data:course
        });
    }catch(error){
        next(error);
    }
};

const updateCourse = async(req, res, next) =>{
    try{

        const { id } = req.params;
        const updatedCourse = await courseService.updateCourse(id, req.body);
        res.status(200).json({
            success:true,
            message:"Course updated successfully",
            data:updatedCourse
        });
    }catch(error){
        next(error);
    }
};

const deleteCourse = async(req, res ,next) => {
    try{
        const {id} = req.params;
        const deleted = await courseService.deleteCourse(id);
        res.status(200).json({
            success:true,
            message:"course deleted successfully"
        });
    }catch(error){
        next(error);
    }
};


module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};