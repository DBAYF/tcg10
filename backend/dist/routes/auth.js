"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const router = express_1.default.Router();
// Validation rules
const registerValidation = [
    (0, express_validator_1.body)('username')
        .isLength({ min: 3, max: 20 })
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username must be 3-20 characters and contain only letters, numbers, and underscores'),
    (0, express_validator_1.body)('displayName')
        .isLength({ min: 1, max: 50 })
        .withMessage('Display name must be 1-50 characters'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    (0, express_validator_1.body)('preferredGames')
        .isArray({ min: 1, max: 5 })
        .withMessage('Select at least 1 preferred game'),
];
const loginValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
];
const forgotPasswordValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
];
const resetPasswordValidation = [
    (0, express_validator_1.body)('token')
        .notEmpty()
        .withMessage('Reset token is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
];
// Routes
router.post('/register', registerValidation, auth_1.register);
router.post('/login', loginValidation, auth_1.login);
router.post('/logout', auth_1.logout);
router.post('/refresh', auth_1.refreshToken);
router.post('/forgot-password', forgotPasswordValidation, auth_1.forgotPassword);
router.post('/reset-password', resetPasswordValidation, auth_1.resetPassword);
router.get('/me', auth_2.protect, auth_1.getMe);
exports.default = router;
//# sourceMappingURL=auth.js.map