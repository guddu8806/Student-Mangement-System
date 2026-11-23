const dashboardRepository = require("../repositories/dashboard.repository");

const dashboardStats = async() =>{
    return await dashboardRepository.getDashboardStats();
};

const getEnrollments = async(options = {}) =>{
    return await dashboardRepository.getAllEnrollments(options);
};

const getAllCourses = async() =>{
    return await dashboardRepository.getAllCourses();
};

module.exports = {
    dashboardStats, getAllCourses, getEnrollments
};
