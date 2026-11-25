const authService = require('../services/auth.service');
const AppError = require("../utils/AppError");

// Register controller
const registerUser = async (req, res, next) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// Login controller
const loginUser = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// Get profile controller
const getProfile = async (req, res, next) => {
    try {
        const result = await authService.getProfile(req.user.id);
        if(!result){
            throw new AppError("User not found" ,404);
        }
        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// Update profile controller (Name/Phone only, email locked)
const updateProfile = async (req, res, next) => {
    try {
        const result = await authService.updateProfile(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// Delete own profile (Admin self-delete)
const deleteProfile = async (req, res, next) => {
    try {
        const result = await authService.deleteAccount(req.user.id);
        res.status(200).json({
            success: true,
            message: 'Account deleted successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// Delete user by ID (Admin deletes another user/admin)
const deleteUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await authService.deleteAccount(Number(id));
        res.status(200).json({
            success: true,
            message: 'User deleted successfully by Admin',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    deleteProfile,
    deleteUserById,
};
