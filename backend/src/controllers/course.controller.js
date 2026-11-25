const courseService = require("../services/courses.service");
const AppError = require('../utils/AppError');


//create , read, update , delete courses
const createCourse = async(req , res, next) =>{
    try{
        const saved = await courseService.createCourse(req.body , req.user.id);
        res.status(201).json({
            success:true,
            message:"Course created successfully",
            data: saved
        });
    }catch(error){
        if(error.code === "23505"){
            return next(new AppError("Course Code must be unique. Please use different code.", 409));
        }
        next(error);
    }
};

const getAllCourses = async(req, res, next) =>{
    try{
        const courses = await courseService.getAllCourses(req.query);
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
        if(!course){
            throw new AppError("Course not found" ,404);
        }
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
        const updatedCourse = await courseService.updateCourse(id, req.body , req.user.id);
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
        const deleted = await courseService.deleteCourse(id ,req.user.id);
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
