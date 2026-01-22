# Cardloom Backend API

## Overview
Cardloom is a comprehensive Trading Card Game (TCG) community platform backend built with Node.js, Express, and PostgreSQL. It provides APIs for card management, marketplace functionality, deck building, social features, and user management.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary (planned)
- **Email**: Nodemailer (planned)
- **Caching**: Redis (planned)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Architecture
```
src/
├── config/           # Database and external service configuration
├── controllers/      # Route handlers
├── middleware/       # Express middleware
├── models/          # Sequelize models
│   ├── user/        # User-related models
│   ├── card/        # Card and set models
│   ├── listing/     # Marketplace models
│   ├── deck/        # Deck building models
│   ├── social/      # Social features models
│   ├── event/       # Event models
│   └── Notification.ts
├── routes/          # API route definitions
├── services/        # Business logic and external API integrations
├── types/           # TypeScript type definitions
├── utils/           # Helper functions
└── index.ts         # Application entry point
```

## Database Schema

### Core Entities
- **Users**: Authentication, profiles, preferences, trading stats
- **Cards**: TCG card data with game-specific attributes
- **CardSets**: Expansion sets and collections
- **Listings**: Marketplace items for sale/trade
- **Offers**: Purchase/trade offers on listings
- **Transactions**: Completed sales with tracking
- **Reviews**: Seller/buyer feedback
- **Decks**: User-created deck builds
- **DeckCards**: Cards within decks with quantities
- **Follows**: User following relationships
- **Messages**: Direct messaging between users
- **Conversations**: Message threads
- **Posts**: Social media posts
- **Comments**: Post replies and engagement
- **Events**: Tournaments and meetups
- **EventRSVPs**: Event attendance
- **Notifications**: Push notifications and alerts

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh` - Refresh access token
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset confirmation
- `GET /me` - Get current user profile

### Users (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /:id` - Get public user profile
- `GET /followers` - Get user's followers
- `GET /following` - Get users user follows
- `POST /:id/follow` - Follow/unfollow user

### Cards (`/api/cards`)
- `GET /` - Search and browse cards
- `GET /:id` - Get card details
- `GET /sets` - Get card sets
- `GET /sets/:id` - Get set details

### Marketplace (`/api/marketplace`)
- `GET /listings` - Browse marketplace listings
- `POST /listings` - Create new listing
- `GET /listings/:id` - Get listing details
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing
- `GET /listings/:id/offers` - Get offers on listing
- `POST /listings/:id/offers` - Make offer on listing
- `POST /offers/:id/respond` - Accept/decline/counter offer
- `GET /transactions` - Get user transactions

### Decks (`/api/decks`)
- `GET /` - Browse public decks
- `POST /` - Create new deck
- `GET /:id` - Get deck details
- `PUT /:id` - Update deck
- `DELETE /:id` - Delete deck
- `POST /:id/cards` - Add card to deck
- `DELETE /:id/cards` - Remove card from deck
- `POST /:id/like` - Like/unlike deck
- `POST /:id/rate` - Rate deck

### Social (`/api/social`)
- `GET /feed` - Get social feed
- `GET /posts` - Get user posts
- `POST /posts` - Create new post
- `GET /posts/:id` - Get post details
- `DELETE /posts/:id` - Delete post
- `POST /posts/:id/like` - Like post
- `GET /posts/:id/comments` - Get post comments
- `POST /posts/:id/comments` - Comment on post
- `GET /messages` - Get conversations
- `GET /messages/:userId` - Get messages with user
- `POST /messages` - Send message

### Events (`/api/events`)
- `GET /` - Browse events
- `POST /` - Create new event
- `GET /:id` - Get event details
- `PUT /:id` - Update event
- `DELETE /:id` - Delete event
- `POST /:id/rsvp` - RSVP to event
- `GET /:id/attendees` - Get event attendees

### Notifications (`/api/notifications`)
- `GET /` - Get user notifications
- `POST /:id/read` - Mark notification as read
- `POST /read-all` - Mark all notifications as read

## Environment Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cardloom
DB_USER=cardloom_user
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRE=30d

# File Upload Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# External API Keys
POKEMON_TCG_API_KEY=your_pokemon_api_key
MTG_API_KEY=your_mtg_api_key
YGOPRO_API_KEY=your_yugioh_api_key

# Payment Configuration
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable

# Redis Configuration
REDIS_URL=redis://localhost:6379
```

## Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd backend
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Database setup:**
   ```bash
   # Create PostgreSQL database
   createdb cardloom

   # Run migrations (when implemented)
   npm run migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Deployment

### Vercel (Serverless Functions)
- API routes are automatically deployed as serverless functions
- Database connections use connection pooling
- File uploads handled via Cloudinary

### Docker (Traditional Server)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Security Features

- **Authentication**: JWT with refresh token rotation
- **Authorization**: Role-based access control
- **Rate Limiting**: API rate limiting by endpoint
- **Input Validation**: Comprehensive input sanitization
- **CORS**: Configured for allowed origins
- **Helmet**: Security headers
- **SQL Injection Protection**: Parameterized queries via Sequelize
- **XSS Protection**: Input validation and sanitization

## Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexing
- **Caching**: Redis for frequently accessed data
- **Pagination**: Cursor-based pagination for large datasets
- **Compression**: Response compression
- **Connection Pooling**: PostgreSQL connection pooling

## Monitoring & Logging

- **Request Logging**: Morgan middleware for HTTP request logging
- **Error Tracking**: Structured error logging
- **Performance Monitoring**: Response time tracking
- **Database Monitoring**: Query performance monitoring

## API Versioning

All endpoints are prefixed with `/api` and versioned via:
- Accept header: `application/vnd.cardloom.v1+json`
- Future versions will use `/api/v2/` prefix

## Contributing

1. Follow TypeScript strict mode
2. Write comprehensive tests
3. Use meaningful commit messages
4. Update documentation for API changes
5. Follow RESTful conventions