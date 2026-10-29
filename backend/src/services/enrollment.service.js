const enrollmentRepository = require("../repositories/enrollment.repository");
const AppError = require("../utils/AppError");
const {validateEnrollment} = require("../validators/enrollment.validator");


// create and drop

const createEnrollment = async(data) =>{
    const errors = validateEnrollment(data);
    if (Object.keys(errors).length > 0) {
        throw new AppError(errors, 400);
    }
    return await enrollmentRepository.createEnrollment(data);
}


const dropEnrollment = async(id) =>{
    const enroll_id = Number(id);

    const existing = await enrollmentRepository.findEnrollment(enroll_id);
    if(!existing){
        throw new AppError("Enrollment not found. ", 404);
    }
    return {message: "Enrollment droped successfully."};
};


module.exports ={
    createEnrollment, dropEnrollment
}