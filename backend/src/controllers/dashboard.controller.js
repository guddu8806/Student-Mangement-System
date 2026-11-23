const dashboardService = require("../services/dashboard.service");

const getDashboardStats = async(req, res, next) =>{
    try{
        const result = await dashboardService.dashboardStats();
        res.status(200).json({
            success: true,
            message:"Dashboard rendered successfully",
            data: result
        });
    }catch(error){
        next(error);
    }
};



const getCourses = async(req, res, next) =>{
    try{
        const result = await dashboardService.getAllCourses();
        res.status(200).json({
            success:true,
            message:"Courses rendered successfully",
            data:result
        });
    }catch(error){
        next(error);
    }
};

const getEnrollments = async(req, res, next) =>{
    try{
        const { page, limit } = req.query;
        const result = await dashboardService.getEnrollments({ page, limit });
        res.status(200).json({
            success:true,
            message:"All Enrollments rendered successfully",
            data:result
        });
    }catch(error){
        next(error);
    }
};


module.exports = {
    getDashboardStats , getCourses  ,getEnrollments
}