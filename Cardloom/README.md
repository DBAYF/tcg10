# Cardloom TCG Platform - Web Version

## Overview

Cardloom is a comprehensive Trading Card Game (TCG) community platform built with React Native and Expo, deployed as a web application. This platform unites collectors, players, and traders across five major TCGs: Pokémon, Magic: The Gathering, Yu-Gi-Oh!, Disney Lorcana, and One Piece.

## Features

### 🎴 Card Catalog
- Browse 15,000+ cards across 5 TCGs
- Advanced filtering by rarity, set, condition, price
- Search functionality with autocomplete
- High-quality card images and detailed information

### 🏪 Marketplace
- Buy, sell, and trade cards securely
- Multiple listing types (sale, trade, sale or trade)
- Advanced filtering and sorting
- Price tracking and market data

### 🃏 Deck Builder
- Create competitive decks for all supported games
- Card search and quantity management
- Format validation and legality checking
- Deck sharing and community features

### 👥 Social Features
- User profiles and following system
- Deck sharing and rating
- Community discussions and events

### 📱 Mobile-First Design
- Responsive design for all screen sizes
- Touch-optimized interface
- Offline-capable architecture

## Technical Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit + Redux Persist
- **Navigation**: React Navigation v6
- **UI Components**: React Native Paper + Custom Components
- **Styling**: StyleSheet with design system
- **Backend**: Express.js + PostgreSQL (planned)
- **Deployment**: Vercel (web)

## Project Structure

```
Cardloom/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── cards/         # Card-related components
│   │   ├── marketplace/   # Marketplace components
│   │   ├── decks/         # Deck building components
│   │   ├── home/          # Home screen components
│   │   ├── navigation/    # Navigation components
│   │   └── common/        # Shared components
│   ├── screens/           # Main screen components
│   ├── navigation/        # Navigation configuration
│   ├── store/             # Redux store and slices
│   ├── types/             # TypeScript type definitions
│   ├── constants/         # App constants and configuration
│   └── utils/             # Utility functions
├── assets/                # Static assets (images, fonts)
├── dist/                  # Built web application (generated)
├── node_modules/          # Dependencies
├── app.json               # Expo configuration
├── package.json           # Node.js dependencies
├── tsconfig.json          # TypeScript configuration
├── vercel.json            # Vercel deployment configuration
└── README.md             # This file
```

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DBAYF/tcg10.git
   cd tcg10/Cardloom
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Run on different platforms:**
   ```bash
   # Web
   npm run web

   # iOS (macOS only)
   npm run ios

   # Android
   npm run android
   ```

## Building for Production

### Web Deployment
```bash
# Build for web
npm run build

# The built files will be in the `dist/` directory
```

### Mobile Deployment
```bash
# Build for iOS/Android using Expo Application Services (EAS)
npx eas build --platform ios
npx eas build --platform android
```

## Vercel Deployment

The application is configured for automatic deployment on Vercel:

### Configuration Files
- `vercel.json`: Vercel deployment configuration
- `package.json`: Build scripts and dependencies

### Environment Variables
Set these in your Vercel dashboard:

```env
NODE_ENV=production
EXPO_PUBLIC_API_URL=https://your-api-url.com
EXPO_PUBLIC_ENVIRONMENT=production
```

### Deployment Steps
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration
3. Set environment variables in Vercel dashboard
4. Deploy automatically on git push

## Architecture Decisions

### State Management
- **Redux Toolkit**: Predictable state management
- **Redux Persist**: Persistent storage across sessions
- **Slice-based architecture**: Organized by feature

### Navigation
- **React Navigation v6**: Modern navigation solution
- **Bottom tabs**: Main app navigation
- **Stack navigation**: Screen transitions

### Design System
- **Consistent spacing**: 4px grid system
- **Color palette**: Primary (#6366F1), secondary (#8B5CF6)
- **Typography**: Hierarchical text styles
- **Component library**: Reusable UI components

### Performance Optimizations
- **Code splitting**: Route-based splitting
- **Image optimization**: Lazy loading and caching
- **Bundle optimization**: Tree shaking and minification
- **Caching**: Redux persist for offline state

## API Integration

### TCG Data Sources
- **Pokémon TCG API**: Official card data
- **Scryfall**: Magic: The Gathering data
- **YGOProDeck**: Yu-Gi-Oh! data
- **Manual**: Lorcana and One Piece data

### Backend API (Planned)
- **Authentication**: JWT-based auth
- **Database**: PostgreSQL with Sequelize
- **Real-time**: WebSocket support
- **File storage**: Cloudinary integration

## Testing

### Current Testing Status
- **Unit Tests**: Not yet implemented
- **Integration Tests**: Not yet implemented
- **E2E Tests**: Not yet implemented

### Testing Setup (Future)
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native

# Run tests
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Create a Pull Request

### Code Standards
- Use TypeScript for all new code
- Follow React Native and Expo best practices
- Use meaningful component and variable names
- Add comments for complex logic
- Test your changes thoroughly

## Roadmap

### Phase 1: Core Features ✅
- Card catalog with search and filtering
- Marketplace with listings
- Deck builder with card management
- Basic user interface and navigation

### Phase 2: Backend Integration 🚧
- Complete API development
- Database implementation
- Authentication system
- File upload and storage

### Phase 3: Advanced Features 📋
- Social features and community
- Real-time messaging
- Event management
- Advanced analytics

### Phase 4: Production Ready 🎯
- Performance optimization
- Comprehensive testing
- Security hardening
- Mobile app store deployment

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Join our community discussions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons from [Expo Vector Icons](https://icons.expo.fyi/)
- UI components inspired by [React Native Paper](https://callstack.github.io/react-native-paper/)