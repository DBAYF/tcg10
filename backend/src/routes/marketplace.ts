import express from 'express';
import { getListings, getListing, getUserListings } from '../controllers/marketplace';

const router = express.Router();

// Marketplace routes
router.get('/listings', getListings);
router.get('/listings/:id', getListing);
router.get('/user/:userId/listings', getUserListings);

export default router;