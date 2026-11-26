const bcrypt = require('bcryptjs');
const authRepository = require('../repositories/auth.repository');
const studentRepository = require('../repositories/student.repository');
const notificationService = require('./notification.service');
const authValidator = require('../validators/auth.validator');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');
const activityLogService = require('./activityLog.service');

const registerUser = async (userData) => {
    authValidator.validateUser(userData);

    const email = userData.email.toLowerCase().trim();
    const role = userData.role ? userData.role.toLowerCase().trim() : 'student';

    let firstName = userData.first_name ? userData.first_name.trim() : '';
    let lastName = userData.last_name ? userData.last_name.trim() : '';

    if (!firstName && userData.name) {
        const parts = userData.name.trim().split(' ');
        firstName = parts[0];
        lastName = parts.slice(1).join(' ') || '';
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const phone = userData.phone ? userData.phone.trim() : null;

    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
        throw new AppError('User with this email already exists', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(userData.password, salt);

    const newUser = await authRepository.createUser({
        name: fullName,
        email,
        password_hash,
        role,
    });

    let studentProfile = null;

    if (role === 'student') {
        studentProfile = await studentRepository.create({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            user_id: newUser.id,
        });

        newUser.student_id = studentProfile.id;
    }

    const token = generateToken(newUser);

    try {
        await notificationService.notifyUser(newUser.id, {
            title: "Welcome to EduCore",
            message: "Your account has been created successfully",
            type: "welcome"
        });
        await notificationService.notifyAdmins({
            title: "New User Registered",
            message: `${newUser.name} registered as a ${role}`,
            type: "user"
        });
    } catch (err) {
        console.error("Notification error:", err.message);
    }

    return {
        user: newUser,
        student: studentProfile,
        token,
    };
};

const loginUser = async (credentials) => {
    authValidator.validateLogin(credentials);

    const email = credentials.email.toLowerCase().trim();
    const password = credentials.password;

    const user = await authRepository.findUserByEmail(email);
    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordCorrect) {
        throw new AppError('Invalid email or password', 401);
    }

    let studentProfile = null;

    if (user.role === 'student') {
        studentProfile = await studentRepository.findByUserId(user.id);
        user.student_id = studentProfile ? studentProfile.id : null;
    }

    const token = generateToken(user);

    delete user.password_hash;

    return {
        user,
        student: studentProfile,
        token,
    };
};

const getProfile = async (userId) => {
    const user = await authRepository.findUserById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    let studentProfile = null;
    if (user.role === 'student') {
        studentProfile = await studentRepository.findByUserId(userId);
    }

    return {
        user,
        student: studentProfile,
    };
};

const updateProfile = async (userId, updateData) => {
    const user = await authRepository.findUserById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (updateData.email && updateData.email.toLowerCase().trim() !== user.email.toLowerCase()) {
        throw new AppError('Email cannot be changed', 400);
    }

    let updatedUser = user;

    let newName = updateData.name ? updateData.name.trim() : null;
    if (updateData.first_name || updateData.last_name) {
        const fName = updateData.first_name ? updateData.first_name.trim() : '';
        const lName = updateData.last_name ? updateData.last_name.trim() : '';
        newName = `${fName} ${lName}`.trim();
    }

    if (newName && newName !== user.name) {
        updatedUser = await authRepository.updateUserName(userId, newName);
    }

    let updatedStudent = null;
    if (user.role === 'student') {
        const studentFields = {};

        if (updateData.phone !== undefined) {
            studentFields.phone = updateData.phone.trim();
        }

        if (updateData.first_name) {
            studentFields.first_name = updateData.first_name.trim();
        } else if (newName) {
            studentFields.first_name = newName.split(' ')[0];
        }

        if (updateData.last_name !== undefined) {
            studentFields.last_name = updateData.last_name.trim();
        } else if (newName) {
            studentFields.last_name = newName.split(' ').slice(1).join(' ') || '';
        }

        if (Object.keys(studentFields).length > 0) {
            updatedStudent = await studentRepository.updateByUserId(userId, studentFields);
        } else {
            updatedStudent = await studentRepository.findByUserId(userId);
        }
    }

    try {
        await notificationService.notifyUser(userId, {
            title: "Profile Update",
            message: "Your account has been updated successfully",
            type: "Update"
        });
    } catch (err) {
        console.error("Notification error:", err.message);
    }
    await activityLogService.logActivity({
        userId: userId,
        action: "PROFILE_UPDATED",
        entityType: "User",
        entityId: updatedStudent ? updatedStudent.id : userId,
        description: user.role === "admin"
            ? `Admin updated their profile`
            : `Student updated their profile`
    });

    return {
        user: updatedUser,
        student: updatedStudent,
    };
};

const deleteAccount = async (userId) => {
    const user = await authRepository.findUserById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    await activityLogService.logActivity({
        userId: userId,
        action: "PROFILE_DELETED",
        entityType: "User",
        entityId: userId,
        description: user.role === "admin"
            ? `Admin deleted their profile`
            : `Student deleted their profile`
    });
    await authRepository.deleteUserById(userId);
    return { message: 'User account deleted successfully' };
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    deleteAccount,
};
