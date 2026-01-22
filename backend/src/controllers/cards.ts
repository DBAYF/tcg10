import { Request, Response, NextFunction } from 'express';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { ApiResponse } from '../types/shared';

// Mock card data for demonstration
const mockCards = [
  {
    id: 'card-1',
    gameId: 'pokemon',
    setId: 'set-1',
    name: 'Charizard',
    number: '4',
    rarity: 'holo_rare',
    imageUrl: 'https://example.com/charizard.jpg',
    rulesText: 'Fire-type Pokémon with 120 HP',
    marketPrice: 45.99,
    attributes: { hp: 120, type: 'Fire' },
  },
  {
    id: 'card-2',
    gameId: 'mtg',
    setId: 'set-2',
    name: 'Black Lotus',
    number: '1',
    rarity: 'mythic_rare',
    imageUrl: 'https://example.com/black-lotus.jpg',
    rulesText: 'Add three mana of any one color',
    marketPrice: 25000.00,
    attributes: { manaCost: '0', type: 'Artifact' },
  },
  {
    id: 'card-3',
    gameId: 'yugioh',
    setId: 'set-3',
    name: 'Blue-Eyes White Dragon',
    number: '001',
    rarity: 'ultra_rare',
    imageUrl: 'https://example.com/blue-eyes.jpg',
    rulesText: 'This legendary dragon is a powerful engine of destruction',
    marketPrice: 89.99,
    attributes: { attack: 3000, defense: 2500, level: 8 },
  },
];

// @desc    Get cards with filtering and search
// @route   GET /api/cards
// @access  Public
export const getCards = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {
    game,
    rarity,
    search,
    limit = '20',
    offset = '0'
  } = req.query;

  let filteredCards = [...mockCards];

  // Filter by game
  if (game && typeof game === 'string') {
    filteredCards = filteredCards.filter(card => card.gameId === game);
  }

  // Filter by rarity
  if (rarity && typeof rarity === 'string') {
    filteredCards = filteredCards.filter(card => card.rarity === rarity);
  }

  // Search by name
  if (search && typeof search === 'string') {
    const searchLower = search.toLowerCase();
    filteredCards = filteredCards.filter(card =>
      card.name.toLowerCase().includes(searchLower)
    );
  }

  // Pagination
  const limitNum = parseInt(limit as string);
  const offsetNum = parseInt(offset as string);
  const paginatedCards = filteredCards.slice(offsetNum, offsetNum + limitNum);

  const response: ApiResponse = {
    success: true,
    data: paginatedCards,
    pagination: {
      total: filteredCards.length,
      limit: limitNum,
      offset: offsetNum,
      hasMore: offsetNum + limitNum < filteredCards.length,
    },
  };

  res.status(200).json(response);
});

// @desc    Get single card
// @route   GET /api/cards/:id
// @access  Public
export const getCard = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const card = mockCards.find(c => c.id === id);

  if (!card) {
    return next(createError('Card not found', 404));
  }

  const response: ApiResponse = {
    success: true,
    data: card,
  };

  res.status(200).json(response);
});

// @desc    Get card sets
// @route   GET /api/cards/sets
// @access  Public
export const getCardSets = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const mockSets = [
    {
      id: 'set-1',
      gameId: 'pokemon',
      name: 'Base Set',
      code: 'BS',
      releaseDate: '1999-01-09',
      totalCards: 102,
      logoUrl: 'https://example.com/base-set-logo.jpg',
    },
    {
      id: 'set-2',
      gameId: 'mtg',
      name: 'Alpha',
      code: 'AL',
      releaseDate: '1993-08-05',
      totalCards: 295,
      logoUrl: 'https://example.com/alpha-logo.jpg',
    },
  ];

  const response: ApiResponse = {
    success: true,
    data: mockSets,
  };

  res.status(200).json(response);
});