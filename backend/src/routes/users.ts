import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// TODO: Implement user routes
router.get('/profile', (req, res) => {
  res.json({ message: 'Get user profile' });
});

router.put('/profile', (req, res) => {
  res.json({ message: 'Update user profile' });
});

export default router;