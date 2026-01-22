import { TCGGame, GameInfo, CardRarity, CardCondition } from '../types';

// Supported TCG Games
export const TCG_GAMES: Record<TCGGame, GameInfo> = {
  pokemon: {
    id: 'pokemon',
    name: 'pokemon',
    displayName: 'Pokémon TCG',
    color: '#FFCB05',
    logoUrl: '', // Will be added with actual URLs
    cardCount: 15000,
    deckSize: 60,
    formats: ['Standard', 'Expanded', 'Unlimited']
  },
  mtg: {
    id: 'mtg',
    name: 'mtg',
    displayName: 'Magic: The Gathering',
    color: '#9146FF',
    logoUrl: '',
    cardCount: 25000,
    deckSize: 60,
    formats: ['Standard', 'Modern', 'Legacy', 'Vintage', 'Commander', 'Pauper']
  },
  yugioh: {
    id: 'yugioh',
    name: 'yugioh',
    displayName: 'Yu-Gi-Oh!',
    color: '#B8860B',
    logoUrl: '',
    cardCount: 12000,
    deckSize: 60,
    formats: ['Master Duel', 'Traditional', 'Speed Duel']
  },
  lorcana: {
    id: 'lorcana',
    name: 'lorcana',
    displayName: 'Disney Lorcana',
    color: '#1E3A8A',
    logoUrl: '',
    cardCount: 1000,
    deckSize: 60,
    formats: ['Core', 'Challenge']
  },
  one_piece: {
    id: 'one_piece',
    name: 'one_piece',
    displayName: 'One Piece TCG',
    color: '#DC2626',
    logoUrl: '',
    cardCount: 2000,
    deckSize: 50,
    formats: ['Standard']
  }
};

// Card Rarity Definitions
export const CARD_RARITIES: CardRarity[] = [
  'common',
  'uncommon',
  'rare',
  'holo_rare',
  'super_rare',
  'secret_rare',
  'mythic_rare',
  'legendary',
  'ultra_rare'
];

// Card Condition Definitions
export const CARD_CONDITIONS: { value: CardCondition; label: string; description: string }[] = [
  {
    value: 'mint',
    label: 'Mint (M)',
    description: 'Perfect condition, never played, factory fresh'
  },
  {
    value: 'near_mint',
    label: 'Near Mint (NM)',
    description: 'Minimal wear, almost perfect, sleeved play only'
  },
  {
    value: 'excellent',
    label: 'Excellent (EX)',
    description: 'Light wear, minor edge whitening, light scratches'
  },
  {
    value: 'good',
    label: 'Good (GD)',
    description: 'Moderate wear, noticeable scratches, corner wear'
  },
  {
    value: 'light_played',
    label: 'Light Played (LP)',
    description: 'Significant wear, creases, heavy scratching'
  },
  {
    value: 'poor',
    label: 'Poor (P)',
    description: 'Heavy damage, bent, water damage, writing'
  }
];

// UI Constants
export const COLORS = {
  primary: '#6366F1', // Indigo 500
  secondary: '#8B5CF6', // Violet 500
  success: '#22C55E', // Green 500
  warning: '#F59E0B', // Amber 500
  error: '#EF4444', // Red 500
  background: {
    dark: '#0F172A', // Slate 900
    light: '#FFFFFF' // White
  },
  surface: {
    dark: '#1E293B', // Slate 800
    light: '#F8FAFC' // Slate 50
  },
  text: {
    primary: '#F8FAFC', // For dark theme
    secondary: '#94A3B8', // Slate 400
    light: '#0F172A' // For light theme
  }
};

export const TYPOGRAPHY = {
  display: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40
  },
  heading1: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24
  }
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999
};

// Navigation Constants
export const TAB_BAR_HEIGHT = 60;
export const HEADER_HEIGHT = 56;

// API Constants
export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.cardloom.com';

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password'
  },
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    publicProfile: (id: string) => `/users/${id}`,
    followers: '/users/followers',
    following: '/users/following',
    follow: (id: string) => `/users/${id}/follow`,
    unfollow: (id: string) => `/users/${id}/unfollow`
  },
  cards: {
    catalog: '/cards',
    detail: (id: string) => `/cards/${id}`,
    sets: '/cards/sets',
    set: (id: string) => `/cards/sets/${id}`
  },
  marketplace: {
    listings: '/marketplace/listings',
    listing: (id: string) => `/marketplace/listings/${id}`,
    createListing: '/marketplace/listings',
    updateListing: (id: string) => `/marketplace/listings/${id}`,
    deleteListing: (id: string) => `/marketplace/listings/${id}`,
    offers: (listingId: string) => `/marketplace/listings/${listingId}/offers`,
    makeOffer: (listingId: string) => `/marketplace/listings/${listingId}/offers`,
    respondOffer: (offerId: string) => `/marketplace/offers/${offerId}/respond`,
    transactions: '/marketplace/transactions',
    transaction: (id: string) => `/marketplace/transactions/${id}`
  },
  decks: {
    list: '/decks',
    create: '/decks',
    detail: (id: string) => `/decks/${id}`,
    update: (id: string) => `/decks/${id}`,
    delete: (id: string) => `/decks/${id}`,
    addCard: (id: string) => `/decks/${id}/cards`,
    removeCard: (id: string) => `/decks/${id}/cards`,
    like: (id: string) => `/decks/${id}/like`,
    rate: (id: string) => `/decks/${id}/rate`
  },
  collections: {
    items: '/collections',
    addItem: '/collections',
    updateItem: (id: string) => `/collections/${id}`,
    removeItem: (id: string) => `/collections/${id}`,
    bulkUpdate: '/collections/bulk'
  },
  events: {
    list: '/events',
    create: '/events',
    detail: (id: string) => `/events/${id}`,
    update: (id: string) => `/events/${id}`,
    delete: (id: string) => `/events/${id}`,
    rsvp: (id: string) => `/events/${id}/rsvp`,
    attendees: (id: string) => `/events/${id}/attendees`
  },
  social: {
    feed: '/social/feed',
    posts: '/social/posts',
    createPost: '/social/posts',
    post: (id: string) => `/social/posts/${id}`,
    likePost: (id: string) => `/social/posts/${id}/like`,
    comments: (postId: string) => `/social/posts/${postId}/comments`,
    createComment: (postId: string) => `/social/posts/${postId}/comments`,
    messages: '/social/messages',
    conversation: (userId: string) => `/social/messages/${userId}`,
    sendMessage: '/social/messages'
  },
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all'
  }
};

// Storage Keys
export const STORAGE_KEYS = {
  auth: {
    token: 'auth_token',
    refreshToken: 'auth_refresh_token',
    user: 'auth_user'
  },
  app: {
    theme: 'app_theme',
    onboarding: 'app_onboarding_completed',
    lastSync: 'app_last_sync'
  },
  cache: {
    cards: 'cache_cards',
    sets: 'cache_sets',
    userData: 'cache_user_data'
  }
};

// Validation Constants
export const VALIDATION = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/
  },
  password: {
    minLength: 8
  },
  displayName: {
    minLength: 1,
    maxLength: 50
  },
  bio: {
    maxLength: 500
  },
  deckTitle: {
    minLength: 1,
    maxLength: 100
  },
  listingTitle: {
    minLength: 1,
    maxLength: 100
  },
  listingDescription: {
    maxLength: 1000
  }
};

// Performance Constants
export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100
};

export const CACHE = {
  cardImageExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
  userDataExpiry: 24 * 60 * 60 * 1000, // 1 day
  searchResultsExpiry: 60 * 60 * 1000 // 1 hour
};

// Animation Constants
export const ANIMATIONS = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500
  },
  easing: {
    standard: 'easeInOut',
    decelerate: 'easeOut',
    accelerate: 'easeIn'
  }
};