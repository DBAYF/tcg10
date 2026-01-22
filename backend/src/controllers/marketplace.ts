import { Request, Response, NextFunction } from 'express';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { ApiResponse } from '../types/shared';

// Mock marketplace data
const mockListings = [
  {
    id: 'listing-1',
    sellerId: 'user-1',
    cardId: 'card-1',
    title: '1st Edition Charizard',
    description: 'Mint condition, never played',
    price: 45.99,
    currency: 'USD',
    condition: 'mint',
    isFoil: false,
    quantity: 1,
    listingType: 'sale',
    status: 'active',
    images: ['https://example.com/charizard-listing.jpg'],
    location: {
      city: 'New York',
      country: 'US',
      latitude: 40.7128,
      longitude: -74.0060,
    },
    shipping: {
      freeShipping: false,
      cost: 5.99,
      method: 'Standard Shipping',
      shipsFrom: {
        city: 'New York',
        country: 'US',
        latitude: 40.7128,
        longitude: -74.0060,
      },
      shipsTo: ['US', 'CA'],
    },
    language: 'English',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'listing-2',
    sellerId: 'user-2',
    cardId: 'card-2',
    title: 'Black Lotus - Near Mint',
    description: 'Alpha edition, slight wear on corners',
    price: 25000.00,
    currency: 'USD',
    condition: 'near_mint',
    isFoil: false,
    quantity: 1,
    listingType: 'sale',
    status: 'active',
    images: ['https://example.com/black-lotus-listing.jpg'],
    location: {
      city: 'Los Angeles',
      country: 'US',
      latitude: 34.0522,
      longitude: -118.2437,
    },
    shipping: {
      freeShipping: true,
      cost: 0,
      method: 'Express Shipping',
      shipsFrom: {
        city: 'Los Angeles',
        country: 'US',
        latitude: 34.0522,
        longitude: -118.2437,
      },
      shipsTo: ['US', 'CA', 'UK', 'DE'],
    },
    language: 'English',
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z',
  },
];

// @desc    Get marketplace listings
// @route   GET /api/marketplace/listings
// @access  Public
export const getListings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {
    game,
    condition,
    priceMin,
    priceMax,
    listingType,
    location,
    limit = '20',
    offset = '0'
  } = req.query;

  let filteredListings = [...mockListings];

  // Filter by price range
  if (priceMin) {
    const minPrice = parseFloat(priceMin as string);
    filteredListings = filteredListings.filter(listing => listing.price >= minPrice);
  }

  if (priceMax) {
    const maxPrice = parseFloat(priceMax as string);
    filteredListings = filteredListings.filter(listing => listing.price <= maxPrice);
  }

  // Filter by listing type
  if (listingType && typeof listingType === 'string') {
    filteredListings = filteredListings.filter(listing => listing.listingType === listingType);
  }

  // Filter by condition
  if (condition && typeof condition === 'string') {
    filteredListings = filteredListings.filter(listing => listing.condition === condition);
  }

  // Pagination
  const limitNum = parseInt(limit as string);
  const offsetNum = parseInt(offset as string);
  const paginatedListings = filteredListings.slice(offsetNum, offsetNum + limitNum);

  const response: ApiResponse = {
    success: true,
    data: paginatedListings,
    pagination: {
      total: filteredListings.length,
      limit: limitNum,
      offset: offsetNum,
      hasMore: offsetNum + limitNum < filteredListings.length,
    },
  };

  res.status(200).json(response);
});

// @desc    Get single listing
// @route   GET /api/marketplace/listings/:id
// @access  Public
export const getListing = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const listing = mockListings.find(l => l.id === id);

  if (!listing) {
    return next(createError('Listing not found', 404));
  }

  const response: ApiResponse = {
    success: true,
    data: listing,
  };

  res.status(200).json(response);
});

// @desc    Get user listings
// @route   GET /api/marketplace/user/:userId/listings
// @access  Public
export const getUserListings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  const userListings = mockListings.filter(listing => listing.sellerId === userId);

  const response: ApiResponse = {
    success: true,
    data: userListings,
  };

  res.status(200).json(response);
});