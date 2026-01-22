# Cardloom TCG Platform - Environment Variables Template

## Frontend Environment Variables (Cardloom/)

```env
# API Configuration
EXPO_PUBLIC_API_URL=https://cardloom-api.vercel.app
EXPO_PUBLIC_ENVIRONMENT=production
EXPO_PUBLIC_VERSION=1.0.0

# Optional: Analytics
EXPO_PUBLIC_ANALYTICS_ID=your-google-analytics-id

# Optional: Feature Flags
EXPO_PUBLIC_ENABLE_NOTIFICATIONS=true
EXPO_PUBLIC_ENABLE_SOCIAL_FEATURES=true
EXPO_PUBLIC_ENABLE_MARKETPLACE=true
```

## Backend Environment Variables (backend/)

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Database Configuration (Required)
DB_HOST=your-project.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-secure-database-password

# JWT Configuration (Required - Generate secure random strings)
JWT_SECRET=your-256-bit-super-secure-jwt-secret-make-it-very-long-and-random
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-256-bit-refresh-secret-different-from-jwt-secret
JWT_REFRESH_EXPIRE=30d

# External TCG APIs (Optional but recommended)
POKEMON_TCG_API_KEY=your-pokemon-tcg-api-key
MTG_API_KEY=your-mtg-scryfall-api-key
YGOPRO_API_KEY=your-yugioh-api-key

# Payment Processing (Optional - for marketplace)
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret

# File Storage (Optional - for card images)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Service (Optional - for notifications)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key

# Push Notifications (Optional)
EXPO_ACCESS_TOKEN=your-expo-access-token

# Redis/Caching (Optional - for performance)
REDIS_URL=redis://your-redis-instance:6379

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## How to Generate Secure Secrets

### JWT Secrets (256-bit):
```bash
# Option 1: Use OpenSSL
openssl rand -base64 32

# Option 2: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Use online generator (development only)
# https://www.uuidgenerator.net/
```

### Database Password:
- Use strong passwords (12+ characters)
- Include uppercase, lowercase, numbers, symbols
- Never reuse passwords
- Consider using password manager

## Service Setup Instructions

### 1. Supabase Database
- Go to [supabase.com](https://supabase.com)
- Create project: "cardloom-prod"
- Copy connection details to DB_* variables

### 2. Stripe Payments
- Go to [stripe.com](https://stripe.com)
- Create account and get API keys
- Use **live keys** for production

### 3. Cloudinary Images
- Go to [cloudinary.com](https://cloudinary.com)
- Create account and get cloud details

### 4. SendGrid Email
- Go to [sendgrid.com](https://sendgrid.com)
- Create account and generate API key

### 5. Expo Notifications
- Go to [expo.dev](https://expo.dev)
- Get access token from account settings

## Verification Commands

### Test Database Connection:
```bash
PGPASSWORD=your-password psql -h your-host -U postgres -d postgres -c "SELECT 1;"
```

### Test API Endpoints:
```bash
# Health check
curl https://cardloom-api.vercel.app/health

# Cards API
curl https://cardloom-api.vercel.app/api/cards

# Marketplace API
curl https://cardloom-api.vercel.app/api/marketplace/listings
```

### Test Frontend:
- Open `https://cardloom.vercel.app` in browser
- Check console for API connection errors
- Test navigation and functionality

## Security Notes

- 🔐 **NEVER commit .env files to version control**
- 🔐 Use different secrets for development/production
- 🔐 Rotate secrets regularly (every 3-6 months)
- 🔐 Monitor for secret exposure in logs
- 🔐 Use environment-specific secrets

### Additional Security Measures:
- Enable 2FA on all service accounts
- Use IP restrictions where possible
- Set up monitoring and alerts
- Regular security audits