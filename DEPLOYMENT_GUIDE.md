# 🚀 Cardloom TCG Platform - Complete Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Cardloom TCG platform, including both the frontend web application and backend API.

---

## 📋 Prerequisites

### System Requirements
- Node.js 18+
- npm or yarn
- Git
- PostgreSQL (for backend)

### Accounts Needed
- [GitHub](https://github.com) - Repository hosting
- [Vercel](https://vercel.com) - Frontend deployment
- [Railway](https://railway.app) or [Heroku](https://heroku.com) - Backend deployment (optional)
- [PostgreSQL Database](https://supabase.com) or [Neon](https://neon.tech) - Database hosting

---

## 🏗️ Phase 1: Repository Setup

### 1. Clone and Verify Repository
```bash
git clone https://github.com/DBAYF/tcg10.git
cd tcg10

# Verify structure
ls -la
# Should show: Cardloom/, backend/, Cardloom_Design_Specification.docx, etc.
```

### 2. Verify Frontend Build
```bash
cd Cardloom
npm install
npm run build

# Should create dist/ folder with build files
ls dist/
# Should show: index.html, _expo/, assets/, etc.
```

### 3. Verify Backend Build
```bash
cd ../backend
npm install
npm run build

# Should create dist/ folder with compiled JavaScript
ls dist/
# Should show: index.js, controllers/, middleware/, etc.
```

---

## 🌐 Phase 2: Frontend Deployment (Vercel)

### Option A: Automatic Vercel Deployment

1. **Connect Repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub: `https://github.com/DBAYF/tcg10.git`
   - Configure project:
     - **Root Directory:** `Cardloom/`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist/`
     - **Install Command:** `npm install`

2. **Environment Variables:**
   ```
   NODE_ENV=production
   EXPO_PUBLIC_API_URL=https://your-backend-api-url.vercel.app
   ```

3. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy
   - Get your frontend URL: `https://cardloom.vercel.app`

### Option B: Manual Vercel CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd Cardloom
vercel --prod

# Follow prompts to configure project
# Set root directory to: ./
# Build command: npm run build
# Output directory: dist
```

---

## 🔧 Phase 3: Backend Deployment

### Option A: Vercel Serverless Functions (Recommended)

1. **Deploy Backend to Vercel:**
   ```bash
   cd backend
   vercel --prod
   ```

2. **Configure Vercel for Backend:**
   - **Root Directory:** `backend/`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/`
   - **Install Command:** `npm install`

3. **Environment Variables for Backend:**
   ```env
   NODE_ENV=production
   DB_HOST=your-database-host
   DB_PORT=5432
   DB_NAME=your-database-name
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   JWT_SECRET=your-super-secure-jwt-secret
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=your-refresh-secret
   JWT_REFRESH_EXPIRE=30d
   ```

### Option B: Railway Deployment

1. **Create Railway Project:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login and create project
   railway login
   railway init cardloom-backend

   # Deploy
   cd backend
   railway up
   ```

2. **Configure Environment Variables:**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set DB_HOST=...
   # Add all required environment variables
   ```

### Option C: Heroku Deployment

1. **Create Heroku App:**
   ```bash
   # Install Heroku CLI
   # Create app
   heroku create cardloom-backend

   # Set buildpack for Node.js
   heroku buildpacks:set heroku/nodejs
   ```

2. **Deploy:**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

---

## 🗄️ Phase 4: Database Setup

### Option A: Supabase (Recommended)

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note the connection details

2. **Run Database Migrations:**
   ```sql
   -- Connect to Supabase SQL editor and run:
   -- The Sequelize sync will create tables automatically
   -- Or run manual migrations if preferred
   ```

### Option B: Railway PostgreSQL

1. **Add PostgreSQL Plugin:**
   ```bash
   railway add postgresql
   # Railway will automatically set DATABASE_URL
   ```

### Option C: Local PostgreSQL (Development)

```bash
# Install PostgreSQL locally
# Create database
createdb cardloom

# Run setup script
cd backend
node setup-db.js
```

---

## ⚙️ Phase 5: Environment Configuration

### Frontend Environment Variables
Create `Cardloom/.env.production`:
```env
EXPO_PUBLIC_API_URL=https://your-backend-url.vercel.app
EXPO_PUBLIC_ENVIRONMENT=production
```

### Backend Environment Variables
Update `backend/.env`:
```env
# Database
DB_HOST=your-db-host.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password

# JWT
JWT_SECRET=your-256-bit-secret-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_REFRESH_EXPIRE=30d

# External APIs (Optional)
POKEMON_TCG_API_KEY=your-key
MTG_API_KEY=your-key
```

### Security Notes
- **JWT Secrets:** Use strong, random strings (256-bit recommended)
- **Database Password:** Never commit to repository
- **API Keys:** Store securely, rotate regularly
- **Environment Variables:** Set in deployment platform, not in code

---

## 🧪 Phase 6: Testing Deployment

### 1. Test Frontend
```bash
# Open deployed URL
open https://cardloom.vercel.app

# Test basic functionality:
# - Navigation between tabs
# - Card catalog browsing
# - Marketplace viewing
# - Deck builder interface
```

### 2. Test Backend API
```bash
# Test health endpoint
curl https://your-backend-url.vercel.app/health

# Test API endpoints
curl https://your-backend-url.vercel.app/api/cards
curl https://your-backend-url.vercel.app/api/marketplace/listings
```

### 3. Test Integration
```bash
# Test frontend-backend communication
# Check browser network tab for API calls
# Verify data loading in components
```

---

## 🔍 Phase 7: Monitoring & Analytics

### Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor performance metrics
- Track user interactions

### Error Monitoring
```bash
# Add error monitoring (optional)
npm install @sentry/react @sentry/node

# Configure in both frontend and backend
```

### Performance Monitoring
- Vercel provides built-in performance metrics
- Monitor API response times
- Track bundle sizes and loading times

---

## 🚀 Phase 8: Production Launch

### Pre-Launch Checklist
- [ ] Frontend deployed and accessible
- [ ] Backend API responding correctly
- [ ] Database connected and populated
- [ ] Environment variables configured
- [ ] SSL certificates active (automatic on Vercel)
- [ ] Domain configured (optional)
- [ ] Basic functionality tested
- [ ] Error handling working
- [ ] Performance acceptable

### Go-Live Steps
1. **Update DNS** (if using custom domain)
2. **Enable production environment variables**
3. **Run final integration tests**
4. **Monitor initial traffic**
5. **Announce launch**

### Post-Launch Monitoring
- Monitor error rates
- Track user engagement
- Performance metrics
- Database usage
- API usage patterns

---

## 🛠️ Troubleshooting

### Common Issues

**Vercel Build Fails:**
```bash
# Check build logs in Vercel dashboard
# Verify package.json scripts
# Check for missing dependencies
# Verify environment variables
```

**API Not Responding:**
```bash
# Check Vercel function logs
# Verify environment variables
# Test database connection
# Check CORS configuration
```

**Database Connection Issues:**
```bash
# Verify connection string
# Check firewall rules
# Confirm credentials
# Test connection locally
```

**Frontend Not Loading:**
```bash
# Check browser console for errors
# Verify API URLs
# Check network tab for failed requests
# Verify build output
```

---

## 📞 Support

### Documentation
- **Frontend:** `Cardloom/README.md`
- **Backend:** `backend/README.md`
- **Requirements:** `backend/REQUIREMENTS.md`
- **Status:** `DEPLOYMENT_STATUS.md`

### Getting Help
- Check Vercel deployment logs
- Review browser developer tools
- Test API endpoints with curl/Postman
- Check database connectivity

---

## 🎯 Success Metrics

### Performance Targets
- **First Paint:** < 2 seconds
- **Largest Contentful Paint:** < 3 seconds
- **API Response Time:** < 500ms
- **Bundle Size:** < 2MB

### Functionality Targets
- ✅ Card catalog loads and filters work
- ✅ Marketplace displays listings
- ✅ Navigation works across all screens
- ✅ API endpoints respond correctly
- ✅ Database connections stable

---

## 🔄 Updates & Maintenance

### Regular Maintenance
```bash
# Update dependencies monthly
npm audit
npm update

# Monitor performance
# Check error logs
# Update security patches
```

### Scaling Considerations
- Monitor usage patterns
- Optimize database queries
- Implement caching strategies
- Consider CDN for assets

---

**🎉 Congratulations! Your Cardloom TCG platform is now live and ready for users!**

**Frontend URL:** `https://cardloom.vercel.app`  
**Backend API:** `https://your-backend-url.vercel.app`  
**Repository:** `https://github.com/DBAYF/tcg10.git`