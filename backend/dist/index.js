"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const cards_1 = __importDefault(require("./routes/cards"));
const marketplace_1 = __importDefault(require("./routes/marketplace"));
const decks_1 = __importDefault(require("./routes/decks"));
const social_1 = __importDefault(require("./routes/social"));
const events_1 = __importDefault(require("./routes/events"));
const notifications_1 = __importDefault(require("./routes/notifications"));
// Import middleware
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
// Import database
const database_1 = require("./config/database");
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);
// Security middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://cardloom.com', 'https://www.cardloom.com']
        : ['http://localhost:8081', 'http://localhost:3000', 'http://localhost:19006'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
// API-specific rate limits
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth attempts per windowMs
    message: {
        error: 'Too many authentication attempts, please try again later.'
    }
});
// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});
// API routes
app.use('/api/auth', authLimiter, auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/cards', cards_1.default);
app.use('/api/marketplace', marketplace_1.default);
app.use('/api/decks', decks_1.default);
app.use('/api/social', social_1.default);
app.use('/api/events', events_1.default);
app.use('/api/notifications', notifications_1.default);
// 404 handler
app.use(notFound_1.notFound);
// Error handling middleware (must be last)
app.use(errorHandler_1.errorHandler);
// Initialize database and start server
const startServer = async () => {
    try {
        // Initialize database connection
        await (0, database_1.initializeDatabase)();
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
            console.log(`📊 Health check available at http://localhost:${PORT}/health`);
            console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err.message);
    console.error(err.stack);
    process.exit(1);
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    console.error(err.stack);
    process.exit(1);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('🛑 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});
// Start the server
startServer();
//# sourceMappingURL=index.js.map