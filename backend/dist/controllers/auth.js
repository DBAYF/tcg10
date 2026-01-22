"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.resetPassword = exports.forgotPassword = exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const User_1 = require("../models/user/User");
const errorHandler_1 = require("../middleware/errorHandler");
// Generate JWT token
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};
// Generate refresh token
const generateRefreshToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
    });
};
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next((0, errorHandler_1.createError)('Validation failed', 400));
    }
    const { username, displayName, email, password, preferredGames } = req.body;
    // Check if user exists
    const existingUser = await User_1.User.findOne({
        where: {
            [sequelize_1.Op.or]: [
                { email },
                { username }
            ]
        }
    });
    if (existingUser) {
        return next((0, errorHandler_1.createError)('User already exists with this email or username', 400));
    }
    // Create user
    const user = await User_1.User.create({
        username,
        displayName,
        email,
        password,
        preferences: {
            theme: 'system',
            defaultGame: preferredGames[0],
            currency: 'USD',
            notifications: {
                offers: true,
                priceDrops: true,
                followers: true,
                events: true,
                messages: true,
                marketing: false,
            },
            privacy: {
                profileVisibility: 'public',
                collectionVisibility: 'private',
                onlineStatus: true,
                lastActiveVisible: true,
                locationVisible: false,
                messagePermissions: 'anyone',
            },
        },
    });
    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const response = {
        success: true,
        data: {
            user: {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                avatarUrl: user.avatarUrl,
                preferences: user.preferences,
                tradingStats: user.tradingStats,
                createdAt: user.createdAt,
            },
            token,
            refreshToken,
        },
    };
    res.status(201).json(response);
});
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next((0, errorHandler_1.createError)('Validation failed', 400));
    }
    const { email, password } = req.body;
    // Check for user
    const user = await User_1.User.findOne({ where: { email } });
    if (!user) {
        return next((0, errorHandler_1.createError)('Invalid credentials', 401));
    }
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next((0, errorHandler_1.createError)('Invalid credentials', 401));
    }
    // Check if user is active
    if (!user.isActive) {
        return next((0, errorHandler_1.createError)('Account is deactivated', 401));
    }
    // Update last login
    user.lastLoginAt = new Date();
    user.lastLoginIp = req.ip;
    await user.save();
    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const response = {
        success: true,
        data: {
            user: {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                avatarUrl: user.avatarUrl,
                preferences: user.preferences,
                tradingStats: user.tradingStats,
                lastLoginAt: user.lastLoginAt,
            },
            token,
            refreshToken,
        },
    };
    res.status(200).json(response);
});
// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const response = {
        success: true,
        message: 'Logged out successfully',
    };
    res.status(200).json(response);
});
// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const { refreshToken: token } = req.body;
    if (!token) {
        return next((0, errorHandler_1.createError)('Refresh token is required', 400));
    }
    try {
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        // Get user
        const user = await User_1.User.findByPk(decoded.id);
        if (!user || !user.isActive) {
            return next((0, errorHandler_1.createError)('Invalid refresh token', 401));
        }
        // Generate new tokens
        const newToken = generateToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);
        const response = {
            success: true,
            data: {
                token: newToken,
                refreshToken: newRefreshToken,
            },
        };
        res.status(200).json(response);
    }
    catch (err) {
        return next((0, errorHandler_1.createError)('Invalid refresh token', 401));
    }
});
// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next((0, errorHandler_1.createError)('Validation failed', 400));
    }
    const { email } = req.body;
    const user = await User_1.User.findOne({ where: { email } });
    if (!user) {
        // Don't reveal if user exists or not for security
        const response = {
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent.',
        };
        return res.status(200).json(response);
    }
    // TODO: Generate reset token and send email
    // For now, just return success message
    const response = {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
    };
    res.status(200).json(response);
});
// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next((0, errorHandler_1.createError)('Validation failed', 400));
    }
    const { token, password } = req.body;
    // TODO: Verify reset token and update password
    // For now, just return success message
    const response = {
        success: true,
        message: 'Password reset successfully',
    };
    res.status(200).json(response);
});
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    const user = await User_1.User.findByPk(req.user.id);
    if (!user) {
        return next((0, errorHandler_1.createError)('User not found', 404));
    }
    const response = {
        success: true,
        data: {
            user: {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                avatarUrl: user.avatarUrl,
                bio: user.bio,
                location: user.location,
                isVerified: user.isVerified,
                role: user.role,
                preferences: user.preferences,
                tradingStats: user.tradingStats,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        },
    };
    res.status(200).json(response);
});
//# sourceMappingURL=auth.js.map