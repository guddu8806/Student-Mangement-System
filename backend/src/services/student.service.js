const studentRepository = require('../repositories/student.repository');
const AppError = require('../utils/AppError');
const {validateStudent, updateStudentValidation} = require('../validators/student.validator');

const createStudent = async(studentData) => {
    const errors = validateStudent(studentData);
    if (Object.keys(errors).length > 0) {
        throw new AppError(errors, 400);
    }
    return await studentRepository.create(studentData);
}


const getAllStudents = async () => {
    return await studentRepository.findAll();
}


const getStudentById = async (id) => {
    const st_id = Number(id);
    if(!Number.isInteger(st_id) || st_id <= 0){
        throw new AppError("Invalid student ID", 400);
    }
    const student = await studentRepository.findById(st_id);
    if(!student){
        throw new AppError("Student Not Found" , 404);
    }
    return student;
}


const updateStudent = async (id, studentData) => {
    const st_id = Number(id);
    if (!Number.isInteger(st_id) || st_id <= 0) {
        throw new AppError("Invalid student ID", 400);
    }
    const errors = updateStudentValidation(studentData);
    if (Object.keys(errors).length > 0) {
        throw new AppError(errors, 400);
    }
    
    const updatedStudent = await studentRepository.update(st_id, studentData);
    if(!updatedStudent){
        throw new AppError("Student Not Found" , 404);
    }
    return updatedStudent;
    
}


const deleteStudent = async (id) => {
    const st_id = Number(id);
    if (!Number.isInteger(st_id) || st_id <= 0) {
        throw new AppError("Invalid student ID", 400);
    }
    const deleted = await studentRepository.deleteById(st_id);
    if (!deleted) {
        throw new AppError("Student not found", 404);
    }
    return { message: "Student deleted successfully" };
};

const notEnrolledStudents = async() =>{
    return await studentRepository.notEnrolledStudent();
};


module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    notEnrolledStudents
}