const dashboardRepository = require("../repositories/dashboard.repository");

const dashboardStats = async() =>{
    return await dashboardRepository.getDashboardStats();
};

const getAllStudents = async() =>{
    return await dashboardRepository.getAllStudentsOnDashboard();
};

const getEnrollments = async() =>{
    return await dashboardRepository.getAllEnrollments();
};

const getAllCourses = async() =>{
    return await dashboardRepository.getAllCourses();
};


module.exports = {
    dashboardStats , getAllCourses , getAllStudents , getEnrollments
}