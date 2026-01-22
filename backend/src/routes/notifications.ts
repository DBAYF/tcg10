import express from 'express';

const router = express.Router();

// TODO: Implement notification routes
router.get('/', (req, res) => {
  res.json({ message: 'Get notifications' });
});

export default router;