const validateEnrollment = (data) => {
    const { student_id, course_id } = data;
    const errors = [];

    if(student_id === undefined || student_id === null || student_id === '' ||
        !Number.isInteger(Number(student_id)) ||Number(student_id) <= 0 ){
        errors.push('Valid positive student_id is required');
    }

    if(course_id === undefined || course_id === null || course_id === '' ||
        !Number.isInteger(Number(course_id)) || Number(course_id) <= 0){
        errors.push('Valid positive course_id is required');
    }

    if(errors.length > 0){
        return errors;
    }
};

const validateDropEnrollment = (req, res, next) => {
    const { studentId, courseId } = req.params;
    const errors = [];

    if(!/^[1-9]\d*$/.test(studentId) || !Number.isSafeInteger(Number(studentId))){
        errors.push('Valid positive studentId is required');
    }

    if(!/^[1-9]\d*$/.test(courseId) || !Number.isSafeInteger(Number(courseId))){
        errors.push('Valid positive courseId is required');
    }

    if(errors.length > 0) {
        return errors;
    }

};

module.exports = {
    validateEnrollment,
    validateDropEnrollment
};