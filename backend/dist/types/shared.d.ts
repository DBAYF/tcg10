export type TCGGame = 'pokemon' | 'mtg' | 'yugioh' | 'lorcana' | 'one_piece';
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'holo_rare' | 'super_rare' | 'secret_rare' | 'mythic_rare' | 'legendary' | 'ultra_rare';
export type CardCondition = 'mint' | 'near_mint' | 'excellent' | 'good' | 'light_played' | 'poor';
export type ListingType = 'sale' | 'trade' | 'sale_or_trade';
export type ListingStatus = 'active' | 'sold' | 'inactive';
export type OfferStatus = 'pending' | 'accepted' | 'declined' | 'countered';
export type TransactionStatus = 'pending_payment' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
export type EventType = 'tournament' | 'meetup' | 'draft' | 'sealed' | 'casual';
export type EventSource = 'community' | 'official';
export type RSVPStatus = 'attending' | 'maybe' | 'declined';
export type NotificationType = 'new_offer' | 'offer_response' | 'new_message' | 'new_follower' | 'deck_engagement' | 'price_drop' | 'event_reminder' | 'order_update';
export type UserRole = 'user' | 'moderator' | 'admin' | 'store_owner';
export type PrivacyLevel = 'public' | 'followers' | 'private';
export type MessagePermission = 'anyone' | 'followers' | 'none';
export type ThemePreference = 'light' | 'dark' | 'system';
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    pagination?: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}
export interface PaginationOptions {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export interface SearchFilters {
    game?: TCGGame;
    rarity?: CardRarity[];
    cardType?: string[];
    set?: string[];
    priceRange?: [number, number];
    condition?: CardCondition[];
    foilOnly?: boolean;
    freeShipping?: boolean;
    location?: string;
    sellerRating?: number;
}
export interface ValidationError {
    field: string;
    message: string;
}
export interface ApiError {
    message: string;
    code: string;
    details?: ValidationError[];
}
//# sourceMappingURL=shared.d.ts.map