"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/user/User");
const errorHandler_1 = require("./errorHandler");
exports.protect = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    let token;
    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies (if using cookies)
    else if (req.cookies?.token) {
        token = req.cookies.token;
    }
    // Make sure token exists
    if (!token) {
        return next((0, errorHandler_1.createError)('Not authorized to access this route', 401));
    }
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Get user from token
        const user = await User_1.User.findByPk(decoded.id);
        if (!user) {
            return next((0, errorHandler_1.createError)('User not found', 401));
        }
        // Check if user is active
        if (!user.isActive) {
            return next((0, errorHandler_1.createError)('User account is deactivated', 401));
        }
        req.user = user;
        next();
    }
    catch (err) {
        return next((0, errorHandler_1.createError)('Not authorized to access this route', 401));
    }
});
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next((0, errorHandler_1.createError)('User not authenticated', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next((0, errorHandler_1.createError)(`User role ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    };
};
exports.authorize = authorize;
exports.optionalAuth = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
    let token;
    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies (if using cookies)
    else if (req.cookies?.token) {
        token = req.cookies.token;
    }
    if (token) {
        try {
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Get user from token
            const user = await User_1.User.findByPk(decoded.id);
            if (user && user.isActive) {
                req.user = user;
            }
        }
        catch (err) {
            // Silently fail for optional auth
        }
    }
    next();
});
//# sourceMappingURL=auth.js.map