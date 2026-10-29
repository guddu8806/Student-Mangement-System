
const validateCourse = (data) => {
    const errors = {};
    const allowedFields = ['course_name', 'course_code', 'description', 'credits'];

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { body: 'Invalid request body' };
    }

    for (const key of Object.keys(data)) {
        if (!allowedFields.includes(key)) {
            errors[key] = 'Invalid field';
        }
    }

    if (!data.course_name?.trim()) {
        errors.course_name = 'Course name is required';
    }

    if (!data.course_code?.trim()) {
        errors.course_code = 'Course code is required';
    }

    if (
        data.credits === undefined ||
        !Number.isInteger(Number(data.credits)) ||
        Number(data.credits) <= 0
    ) {
        errors.credits = 'Credits must be a positive integer';
    }

    if (data.description !== undefined && typeof data.description !== 'string') {
        errors.description = 'Description must be a string';
    }

    return errors;
};

const updateCourseValidation = (data) => {
    const errors = {};
    const allowedFields = ['course_name', 'course_code', 'description', 'credits'];

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { body: 'Invalid request body' };
    }

    const fields = Object.keys(data).filter(key => allowedFields.includes(key));

    if (fields.length === 0) {
        errors.body = 'Provide at least one valid field to update';
    }

    for (const key of Object.keys(data)) {
        if (!allowedFields.includes(key)) {
            errors[key] = 'Invalid field';
        }
    }

    if (data.course_name !== undefined &&
        (typeof data.course_name !== 'string' || !data.course_name.trim())) {
        errors.course_name = 'Invalid course name';
    }

    if (data.course_code !== undefined &&
        (typeof data.course_code !== 'string' || !data.course_code.trim())) {
        errors.course_code = 'Invalid course code';
    }

    if (data.description !== undefined && typeof data.description !== 'string') {
        errors.description = 'Description must be a string';
    }

    if (data.credits !== undefined &&
        (!Number.isInteger(Number(data.credits)) || Number(data.credits) <= 0)) {
        errors.credits = 'Credits must be a positive integer';
    }

    return errors;
};

module.exports = { validateCourse, updateCourseValidation };
