import express from 'express';

const router = express.Router();

// TODO: Implement event routes
router.get('/', (req, res) => {
  res.json({ message: 'Get events' });
});

export default router;