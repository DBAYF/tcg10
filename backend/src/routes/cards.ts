import express from 'express';
import { getCards, getCard, getCardSets } from '../controllers/cards';

const router = express.Router();

// Card routes
router.get('/', getCards);
router.get('/:id', getCard);
router.get('/sets', getCardSets);

export default router;