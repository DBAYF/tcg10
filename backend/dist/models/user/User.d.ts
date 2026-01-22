import { Model } from 'sequelize-typescript';
import { TCGGame } from '../../types/shared';
import { Listing } from '../listing/Listing';
import { Deck } from '../deck/Deck';
import { Message } from '../social/Message';
import { Post } from '../social/Post';
import { Event } from '../event/Event';
import { Notification } from '../Notification';
export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    defaultGame: TCGGame;
    currency: string;
    notifications: {
        offers: boolean;
        priceDrops: boolean;
        followers: boolean;
        events: boolean;
        messages: boolean;
        marketing: boolean;
    };
    privacy: {
        profileVisibility: 'public' | 'followers' | 'private';
        collectionVisibility: 'public' | 'followers' | 'private';
        onlineStatus: boolean;
        lastActiveVisible: boolean;
        locationVisible: boolean;
        messagePermissions: 'anyone' | 'followers' | 'none';
    };
}
export interface TradingStats {
    totalTrades: number;
    sellerRating: number;
    reviewCount: number;
    successfulTrades: number;
}
export declare class User extends Model {
    username: string;
    displayName: string;
    email: string;
    password: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    isVerified: boolean;
    role: 'user' | 'moderator' | 'admin' | 'store_owner';
    isActive: boolean;
    totalTrades: number;
    sellerRating: number;
    reviewCount: number;
    successfulTrades: number;
    preferences?: UserPreferences;
    lastLoginAt?: Date;
    lastLoginIp?: string;
    get tradingStats(): TradingStats;
    listings: Listing[];
    decks: Deck[];
    posts: Post[];
    sentMessages: Message[];
    receivedMessages: Message[];
    organizedEvents: Event[];
    notifications: Notification[];
    following: User[];
    followers: User[];
    comparePassword(candidatePassword: string): Promise<boolean>;
    getPublicProfile(): {
        id: any;
        username: string;
        displayName: string;
        avatarUrl: string | undefined;
        bio: string | undefined;
        location: string | undefined;
        isVerified: boolean;
        tradingStats: TradingStats;
        memberSince: any;
    };
    static hashPassword(instance: User): Promise<void>;
}
//# sourceMappingURL=User.d.ts.map