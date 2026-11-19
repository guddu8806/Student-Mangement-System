const studentRepository = require('../repositories/student.repository');
const AppError = require('../utils/AppError');
const {validateStudent, updateStudentValidation} = require('../validators/student.validator');
const activityLogService = require('./activityLog.service');

const createStudent = async(studentData,performedByUserId) => {
    const errors = validateStudent(studentData);
    if (Object.keys(errors).length > 0) {
        throw new AppError(errors, 400);
    }
    const newStudent = await studentRepository.create(studentData);
    await activityLogService.logActivity({
        userId: performedByUserId,
        action: 'STUDENT_CREATE',
        entityType: 'student',
        entityId: newStudent.id,
        description: `Created student ${newStudent.first_name} ${newStudent.last_name}`
    });
    return newStudent;
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


const updateStudent = async (id, studentData ,performedByUserId) => {
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
    await activityLogService.logActivity({
        userId: performedByUserId,
        action: 'STUDENT_UPDATE',
        entityType: 'student',
        entityId: id,
        description: `Updated student ${updatedStudent.first_name} ${updatedStudent.last_name} (${updatedStudent.email})`
    });
    return updatedStudent;
    
}


const deleteStudent = async (id, performedByUserId) => {
    const st_id = Number(id);
    if (!Number.isInteger(st_id) || st_id <= 0) throw new AppError("Invalid student ID", 400);
    const student = await studentRepository.findById(st_id);
    if (!student) throw new AppError("Student not found", 404);

    await studentRepository.deleteById(st_id);

    await activityLogService.logActivity({
        userId: performedByUserId,
        action: 'STUDENT_DELETE',
        entityType: 'student',
        entityId: id,
        description: `Deleted student ${student.first_name} ${student.last_name} (${student.email})`
    });
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