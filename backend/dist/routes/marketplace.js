"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// TODO: Implement marketplace routes
router.get('/listings', (req, res) => {
    res.json({ message: 'Get marketplace listings' });
});
exports.default = router;
//# sourceMappingURL=marketplace.js.map