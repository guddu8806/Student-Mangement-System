const studentService = require('../services/student.service');
const AppError = require('../utils/AppError');


// create , view, update, delete student
const createStudent = async (req, res, next) => {
    try{
        const studentData = req.body;
        const newStudent = await studentService.createStudent(studentData , req.user.id);
        res.status(201).json({
            success: true,
            message:"Student created successfully",
            data: newStudent
        });
    } catch (error) {
        if(error.code === "23505"){
            return next(new AppError("Students already exists. Please use different email address.", 409));
        }
        next(error);
    }
}

const getAllStudents = async(req, res, next) =>{
    try{
        const students = await studentService.getAllStudents();
        res.status(200).json({
            success: true,
            message:"Students retrieved successfully",
            data: students
        });
    }catch(error){
        next(error);
    }
}

const getStudentById = async (req, res, next) => {
    try{
        const {id} = req.params;
        const student = await studentService.getStudentById(id);
        res.status(200).json({
            success: true,
            message:"Student retrieved successfully",
            data: student
        });
    }catch(error){
        next(error);
    }
}

const updateStudent = async(req, res, next) =>{
    try{
        const { id } = req.params;
        const updatedStudent = await studentService.updateStudent(id, req.body , req.user.id);
        res.status(200).json({
            success: true,
            message: "Student Updated Successfully",
            data: updatedStudent
        });
    }catch(error){
        next(error);
    }
};

const deleteStudent = async(req, res, next) =>{
    try{
        const {id} = req.params;
        const deleteStudent = await studentService.deleteStudent(id, req.user.id);
        res.status(200).json({
            success:true,
            message: "Student deleted successfully"
        });
    }catch(error){
        next(error);
    }
};

const notEnrolledStudents = async(req, res,next) =>{
    try{
        const result = await studentService.notEnrolledStudents();
        res.status(200).json({
            success:true,
            message:"These students are not enrolled in any courses.",
            data:result
        });
    }catch(error){
        next(error);
    }
};


module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    notEnrolledStudents
}
