import express from 'express';

const router = express.Router();

// TODO: Implement deck routes
router.get('/', (req, res) => {
  res.json({ message: 'Get decks' });
});

export default router;