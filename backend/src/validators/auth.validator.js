const AppError = require('../utils/AppError');

const validateUser = (user) => {
    if (!user || typeof user !== 'object' || Array.isArray(user)) {
        throw new AppError('Invalid request body', 400);
    }

    const { email, password, role } = user;
    const name = user.name || (user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '');
    const errors = {};

    if (!name) {
        errors.name = 'Name is required';
    }

    if (!email || !email.trim()) {
        errors.email = 'Email is required';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            errors.email = 'Invalid email format';
        }
    }

    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
    }

    if (role !== undefined && role !== null && role !== '') {
        const allowedRoles = ['admin', 'student'];
        if (!allowedRoles.includes(String(role).toLowerCase().trim())) {
            errors.role = 'Role must be either "admin" or "student"';
        }
    }

    if (Object.keys(errors).length > 0) {
        throw new AppError(errors, 400);
    }
};

const validateLogin = (data) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new AppError('Invalid request body', 400);
    }

    const { email, password } = data;
    const errors = {};

    if (!email || !email.trim()) {
        errors.email = 'Email is required';
    }

    if (!password) {
        errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
        throw new AppError(errors, 400);
    }
};

module.exports = {
    validateUser,
    validateLogin,
};
