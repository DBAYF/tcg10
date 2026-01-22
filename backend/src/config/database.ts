import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'cardloom',
  username: process.env.DB_USER || 'cardloom_user',
  password: process.env.DB_PASSWORD || '',
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true, // Soft deletes
  },
});

// Import models
import { User } from '../models/user/User';
import { Card } from '../models/card/Card';
import { CardSet } from '../models/card/CardSet';
import { Listing } from '../models/listing/Listing';
import { Offer } from '../models/listing/Offer';
import { Transaction } from '../models/listing/Transaction';
import { Review } from '../models/listing/Review';
import { Deck } from '../models/deck/Deck';
import { DeckCard } from '../models/deck/DeckCard';
import { Follow } from '../models/social/Follow';
import { Message } from '../models/social/Message';
import { Conversation } from '../models/social/Conversation';
import { Post } from '../models/social/Post';
import { Comment } from '../models/social/Comment';
import { Event } from '../models/event/Event';
import { EventRSVP } from '../models/event/EventRSVP';
import { Notification } from '../models/Notification';

// Add models to sequelize
sequelize.addModels([
  User,
  Card,
  CardSet,
  Listing,
  Offer,
  Transaction,
  Review,
  Deck,
  DeckCard,
  Follow,
  Message,
  Conversation,
  Post,
  Comment,
  Event,
  EventRSVP,
  Notification,
]);

// Initialize database
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    // Sync models (create tables)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized');
    } else {
      // In production, use migrations instead of sync
      console.log('ℹ️  Production mode: Using migrations for schema updates');
    }

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export default sequelize;