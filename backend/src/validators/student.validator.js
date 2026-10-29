// const allowedfields = ['first_name', 'last_name', 'email', 'phone'];

const validateStudent = (data, isUpdate = false) => {
    const errors = {};

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { body: 'Invalid request body' };
    }

    if (!data.first_name?.trim()) {
        errors.first_name = "First name is required";
    }
    if (!data.last_name?.trim()) {
        errors.last_name = "Last name is required";
    }
    if (!data.email?.trim()) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Invalid email format";
    }

    if (data.phone && !/^\+?[1-9]\d{1,14}$/.test(data.phone)) {
        errors.phone = "Invalid phone number format";
    }

    return errors;
};

const updateStudentValidation = (data) => {
    const errors = {};

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { body: 'Invalid request body' };
    }

    const allowedFields = ['first_name', 'last_name', 'email', 'phone'];
    const fields = Object.keys(data).filter(key => allowedFields.includes(key));

    if (fields.length === 0) {
        errors.body = "No valid fields provided for update";
    }
    for (const field of fields) {
        if (!allowedFields.includes(field)) {
            errors[field] = `${field} is not a valid field`;
        }
        if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[field])) {
            errors.email = "Invalid email format";
        }
        if (field === 'phone' && data.phone && !/^\+?[1-9]\d{1,14}$/.test(data.phone)) {
            errors.phone = "Invalid phone number format";
        }
        if ((field === 'first_name' || field === 'last_name') && !data[field]?.trim()) {
            errors[field] = `${field.replace('_', ' ')} is required`;
        }
    }
    return errors;
};

module.exports = { validateStudent, updateStudentValidation };
