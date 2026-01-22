import express from 'express';

const router = express.Router();

// TODO: Implement card routes
router.get('/', (req, res) => {
  res.json({ message: 'Get cards' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get card by ID' });
});

export default router;