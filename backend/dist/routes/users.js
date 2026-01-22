"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.protect);
// TODO: Implement user routes
router.get('/profile', (req, res) => {
    res.json({ message: 'Get user profile' });
});
router.put('/profile', (req, res) => {
    res.json({ message: 'Update user profile' });
});
exports.default = router;
//# sourceMappingURL=users.js.map