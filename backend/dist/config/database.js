"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Database configuration
const sequelize = new sequelize_typescript_1.Sequelize({
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
const User_1 = require("../models/user/User");
const Card_1 = require("../models/card/Card");
const CardSet_1 = require("../models/card/CardSet");
const Listing_1 = require("../models/listing/Listing");
const Offer_1 = require("../models/listing/Offer");
const Transaction_1 = require("../models/listing/Transaction");
const Review_1 = require("../models/listing/Review");
const Deck_1 = require("../models/deck/Deck");
const DeckCard_1 = require("../models/deck/DeckCard");
const Follow_1 = require("../models/social/Follow");
const Message_1 = require("../models/social/Message");
const Conversation_1 = require("../models/social/Conversation");
const Post_1 = require("../models/social/Post");
const Comment_1 = require("../models/social/Comment");
const Event_1 = require("../models/event/Event");
const EventRSVP_1 = require("../models/event/EventRSVP");
const Notification_1 = require("../models/Notification");
// Add models to sequelize
sequelize.addModels([
    User_1.User,
    Card_1.Card,
    CardSet_1.CardSet,
    Listing_1.Listing,
    Offer_1.Offer,
    Transaction_1.Transaction,
    Review_1.Review,
    Deck_1.Deck,
    DeckCard_1.DeckCard,
    Follow_1.Follow,
    Message_1.Message,
    Conversation_1.Conversation,
    Post_1.Post,
    Comment_1.Comment,
    Event_1.Event,
    EventRSVP_1.EventRSVP,
    Notification_1.Notification,
]);
// Initialize database
const initializeDatabase = async () => {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');
        // Sync models (create tables)
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('✅ Database models synchronized');
        }
        else {
            // In production, use migrations instead of sync
            console.log('ℹ️  Production mode: Using migrations for schema updates');
        }
    }
    catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
exports.default = sequelize;
//# sourceMappingURL=database.js.map