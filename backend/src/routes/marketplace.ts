import express from 'express';

const router = express.Router();

// TODO: Implement marketplace routes
router.get('/listings', (req, res) => {
  res.json({ message: 'Get marketplace listings' });
});

export default router;