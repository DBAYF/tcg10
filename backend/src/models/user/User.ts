import { Table, Column, Model, DataType, HasMany, BelongsToMany, Default, AllowNull, Unique, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';
import { TCGGame } from '../../types/shared';

// Import related models
import { Listing } from '../listing/Listing';
import { Deck } from '../deck/Deck';
import { Follow } from '../social/Follow';
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

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
export class User extends Model {
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(50))
  username!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  displayName!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(255))
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  password!: string;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  avatarUrl?: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  bio?: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  location?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isVerified!: boolean;

  @Default('user')
  @Column(DataType.ENUM('user', 'moderator', 'admin', 'store_owner'))
  role!: 'user' | 'moderator' | 'admin' | 'store_owner';

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive!: boolean;

  @Default(0)
  @Column(DataType.INTEGER)
  totalTrades!: number;

  @Default(0)
  @Column(DataType.DECIMAL(3, 2))
  sellerRating!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  reviewCount!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  successfulTrades!: number;

  @AllowNull(true)
  @Column(DataType.JSON)
  preferences?: UserPreferences;

  @AllowNull(true)
  @Column(DataType.DATE)
  lastLoginAt?: Date;

  @AllowNull(true)
  @Column(DataType.STRING(45))
  lastLoginIp?: string;

  // Virtual fields
  get tradingStats(): TradingStats {
    return {
      totalTrades: this.totalTrades,
      sellerRating: parseFloat(this.sellerRating.toString()),
      reviewCount: this.reviewCount,
      successfulTrades: this.successfulTrades,
    };
  }

  // Relationships
  @HasMany(() => Listing, 'sellerId')
  listings!: Listing[];

  @HasMany(() => Deck, 'userId')
  decks!: Deck[];

  @HasMany(() => Post, 'authorId')
  posts!: Post[];

  @HasMany(() => Message, 'senderId')
  sentMessages!: Message[];

  @HasMany(() => Message, 'recipientId')
  receivedMessages!: Message[];

  @HasMany(() => Event, 'organizerId')
  organizedEvents!: Event[];

  @HasMany(() => Notification, 'userId')
  notifications!: Notification[];

  // Follow relationships
  @BelongsToMany(() => User, () => Follow, 'followerId', 'followingId')
  following!: User[];

  @BelongsToMany(() => User, () => Follow, 'followingId', 'followerId')
  followers!: User[];

  // Instance methods
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  public getPublicProfile() {
    return {
      id: this.id,
      username: this.username,
      displayName: this.displayName,
      avatarUrl: this.avatarUrl,
      bio: this.bio,
      location: this.location,
      isVerified: this.isVerified,
      tradingStats: this.tradingStats,
      memberSince: this.createdAt,
    };
  }

  // Hooks
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt(12);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }
}