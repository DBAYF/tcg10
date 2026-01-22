// Core TCG Game Types
export type TCGGame = 'pokemon' | 'mtg' | 'yugioh' | 'lorcana' | 'one_piece';

export interface GameInfo {
  id: TCGGame;
  name: string;
  displayName: string;
  color: string;
  logoUrl: string;
  cardCount: number;
  deckSize: number;
  formats: string[];
}

// Card-related types
export interface CardSet {
  id: string;
  gameId: TCGGame;
  name: string;
  code: string;
  releaseDate: string;
  totalCards: number;
  logoUrl?: string;
}

export interface Card {
  id: string;
  setId: string;
  name: string;
  number: string;
  rarity: CardRarity;
  imageUrl: string;
  rulesText?: string;
  marketPrice?: number;
  attributes?: Record<string, any>; // Game-specific attributes
  relatedCards?: string[]; // Evolution chains, alternate versions
}

export type CardRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'holo_rare'
  | 'super_rare'
  | 'secret_rare'
  | 'mythic_rare'
  | 'legendary'
  | 'ultra_rare';

export type CardCondition = 'mint' | 'near_mint' | 'excellent' | 'good' | 'light_played' | 'poor';

// User-related types
export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  memberSince: string;
  tradingStats: TradingStats;
  preferences: UserPreferences;
  isVerified?: boolean;
}

export interface TradingStats {
  totalTrades: number;
  sellerRating: number;
  reviewCount: number;
  successfulTrades: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultGame: TCGGame;
  currency: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  offers: boolean;
  priceDrops: boolean;
  followers: boolean;
  events: boolean;
  messages: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'followers' | 'private';
  collectionVisibility: 'public' | 'followers' | 'private';
  onlineStatus: boolean;
  lastActiveVisible: boolean;
  locationVisible: boolean;
  messagePermissions: 'anyone' | 'followers' | 'none';
}

// Collection types
export interface CollectionItem {
  id: string;
  userId: string;
  cardId: string;
  quantity: number;
  condition: CardCondition;
  isFoil: boolean;
  purchasePrice?: number;
  forSale: boolean;
  forTrade: boolean;
  visibility: 'public' | 'followers' | 'private';
  notes?: string;
  addedDate: string;
}

// Marketplace types
export interface Listing {
  id: string;
  sellerId: string;
  cardId: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  condition: CardCondition;
  isFoil: boolean;
  quantity: number;
  listingType: 'sale' | 'trade' | 'sale_or_trade';
  status: 'active' | 'sold' | 'inactive';
  images: string[];
  location: LocationInfo;
  shipping: ShippingInfo;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationInfo {
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface ShippingInfo {
  freeShipping: boolean;
  cost?: number;
  method: string;
  shipsFrom: LocationInfo;
  shipsTo: string[]; // Country codes
}

export interface Offer {
  id: string;
  listingId: string;
  buyerId: string;
  amount?: number;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: 'pending_payment' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  trackingNumber?: string;
  shippingCarrier?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  transactionId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
}

// Deck types
export interface Deck {
  id: string;
  userId: string;
  gameId: TCGGame;
  title: string;
  description?: string;
  format: string;
  isPublic: boolean;
  coverImageUrl?: string;
  tags: string[];
  stats: DeckStats;
  createdAt: string;
  updatedAt: string;
}

export interface DeckStats {
  totalCards: number;
  cardCounts: Record<string, number>; // Type breakdown
  estimatedValue: number;
  likes: number;
  rating: number;
  viewCount: number;
}

export interface DeckCard {
  id: string;
  deckId: string;
  cardId: string;
  quantity: number;
  notes?: string;
}

// Social types
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  status: 'active' | 'blocked';
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  images?: string[];
  relatedListingId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  images?: string[];
  relatedDeckId?: string;
  relatedListingId?: string;
  relatedEventId?: string;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentCommentId?: string; // For nested replies
  likes: number;
  createdAt: string;
}

// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  gameId: TCGGame;
  eventType: 'tournament' | 'meetup' | 'draft' | 'sealed' | 'casual';
  source: 'community' | 'official';
  startDate: string;
  endDate: string;
  location: EventLocation;
  maxAttendees?: number;
  currentAttendees: number;
  entryFee?: number;
  organizerId: string;
  coverImageUrl?: string;
  createdAt: string;
}

export interface EventLocation {
  name: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface EventRSVP {
  id: string;
  eventId: string;
  userId: string;
  status: 'attending' | 'maybe' | 'declined';
  createdAt: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType =
  | 'new_offer'
  | 'offer_response'
  | 'new_message'
  | 'new_follower'
  | 'deck_engagement'
  | 'price_drop'
  | 'event_reminder'
  | 'order_update';

// UI and Navigation types
export interface FilterOptions {
  game?: TCGGame;
  rarity?: CardRarity[];
  cardType?: string[];
  set?: string[];
  priceRange?: [number, number];
  condition?: CardCondition[];
  foilOnly?: boolean;
  freeShipping?: boolean;
}

export interface SearchOptions {
  query: string;
  filters: FilterOptions;
  sortBy: 'popularity' | 'name_asc' | 'name_desc' | 'price_low' | 'price_high' | 'newest';
  limit: number;
  offset: number;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: PaginationInfo;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  username: string;
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  preferredGames: TCGGame[];
}

export interface CreateListingForm {
  cardId: string;
  title: string;
  description?: string;
  price: number;
  condition: CardCondition;
  isFoil: boolean;
  quantity: number;
  listingType: 'sale' | 'trade' | 'sale_or_trade';
  images: string[];
  shipping: ShippingInfo;
  language: string;
  location: LocationInfo;
}

export interface CreateDeckForm {
  title: string;
  gameId: TCGGame;
  format: string;
  description?: string;
  isPublic: boolean;
  coverImageUrl?: string;
  tags: string[];
}

// State management types
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  theme: 'light' | 'dark' | 'system';
  isOnline: boolean;
  lastSync: string | null;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};