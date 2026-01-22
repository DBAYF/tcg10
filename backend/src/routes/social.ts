import express from 'express';

const router = express.Router();

// TODO: Implement social routes
router.get('/feed', (req, res) => {
  res.json({ message: 'Get social feed' });
});

export default router;