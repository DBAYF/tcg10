import AsyncStorage from '@react-native-async-storage/async-storage';

// Local Storage Keys
export const STORAGE_KEYS = {
  // User data
  USER_PROFILE: 'user_profile',
  USER_PREFERENCES: 'user_preferences',
  USER_COLLECTIONS: 'user_collections',
  USER_DECKS: 'user_decks',
  USER_WATCHLIST: 'user_watchlist',

  // App data
  APP_SETTINGS: 'app_settings',
  APP_CACHE: 'app_cache',
  RECENT_SEARCHES: 'recent_searches',
  FAVORITE_CARDS: 'favorite_cards',

  // Social features
  FRIENDS_LIST: 'friends_list',
  SOCIAL_POSTS: 'social_posts',
  USER_COMMENTS: 'user_comments',
  DECK_COMMENTS: 'deck_comments',

  // Analytics
  APP_USAGE_STATS: 'app_usage_stats',
  SEARCH_HISTORY: 'search_history',
  VIEWED_CARDS: 'viewed_cards',
};

// Storage Service Class
class LocalStorageService {
  // Generic storage methods
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving to local storage:', error);
      throw error;
    }
  }

  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading from local storage:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from local storage:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing local storage:', error);
      throw error;
    }
  }

  // User Profile Management
  async saveUserProfile(profile: any): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_PROFILE, profile);
  }

  async getUserProfile(): Promise<any | null> {
    return this.getItem(STORAGE_KEYS.USER_PROFILE);
  }

  async updateUserProfile(updates: Partial<any>): Promise<void> {
    const currentProfile = await this.getUserProfile() || {};
    const updatedProfile = { ...currentProfile, ...updates };
    await this.saveUserProfile(updatedProfile);
  }

  // User Preferences
  async saveUserPreferences(preferences: any): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  async getUserPreferences(): Promise<any | null> {
    return this.getItem(STORAGE_KEYS.USER_PREFERENCES);
  }

  // Collection Management
  async saveCollection(collection: any[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_COLLECTIONS, collection);
  }

  async getCollection(): Promise<any[]> {
    return this.getItem(STORAGE_KEYS.USER_COLLECTIONS) || [];
  }

  async addToCollection(card: any): Promise<void> {
    const collection = await this.getCollection();
    const existingIndex = collection.findIndex(c => c.cardId === card.cardId && c.condition === card.condition);

    if (existingIndex >= 0) {
      collection[existingIndex].quantity += card.quantity || 1;
    } else {
      collection.push({ ...card, id: Date.now().toString(), dateAdded: new Date().toISOString() });
    }

    await this.saveCollection(collection);
  }

  async removeFromCollection(cardId: string, condition?: string): Promise<void> {
    const collection = await this.getCollection();
    const filtered = collection.filter(c =>
      !(c.cardId === cardId && (!condition || c.condition === condition))
    );
    await this.saveCollection(filtered);
  }

  async updateCollectionItem(cardId: string, updates: Partial<any>): Promise<void> {
    const collection = await this.getCollection();
    const index = collection.findIndex(c => c.id === cardId);
    if (index >= 0) {
      collection[index] = { ...collection[index], ...updates };
      await this.saveCollection(collection);
    }
  }

  // Deck Management
  async saveDecks(decks: any[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_DECKS, decks);
  }

  async getDecks(): Promise<any[]> {
    return this.getItem(STORAGE_KEYS.USER_DECKS) || [];
  }

  async saveDeck(deck: any): Promise<void> {
    const decks = await this.getDecks();
    const existingIndex = decks.findIndex(d => d.id === deck.id);

    if (existingIndex >= 0) {
      decks[existingIndex] = { ...deck, lastModified: new Date().toISOString() };
    } else {
      decks.push({ ...deck, id: Date.now().toString(), createdAt: new Date().toISOString() });
    }

    await this.saveDecks(decks);
  }

  async deleteDeck(deckId: string): Promise<void> {
    const decks = await this.getDecks();
    const filtered = decks.filter(d => d.id !== deckId);
    await this.saveDecks(filtered);
  }

  async duplicateDeck(deckId: string, newName: string): Promise<void> {
    const decks = await this.getDecks();
    const deck = decks.find(d => d.id === deckId);
    if (deck) {
      const duplicatedDeck = {
        ...deck,
        id: Date.now().toString(),
        name: newName,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };
      decks.push(duplicatedDeck);
      await this.saveDecks(decks);
    }
  }

  // Watchlist Management
  async saveWatchlist(watchlist: any[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_WATCHLIST, watchlist);
  }

  async getWatchlist(): Promise<any[]> {
    return this.getItem(STORAGE_KEYS.USER_WATCHLIST) || [];
  }

  async addToWatchlist(card: any, targetPrice?: number): Promise<void> {
    const watchlist = await this.getWatchlist();
    const existingIndex = watchlist.findIndex(w => w.cardId === card.id);

    if (existingIndex >= 0) {
      watchlist[existingIndex] = { ...watchlist[existingIndex], targetPrice, lastUpdated: new Date().toISOString() };
    } else {
      watchlist.push({
        id: Date.now().toString(),
        cardId: card.id,
        cardName: card.name,
        currentPrice: card.price,
        targetPrice,
        game: card.game,
        imageUrl: card.imageUrl,
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      });
    }

    await this.saveWatchlist(watchlist);
  }

  async removeFromWatchlist(cardId: string): Promise<void> {
    const watchlist = await this.getWatchlist();
    const filtered = watchlist.filter(w => w.cardId !== cardId);
    await this.saveWatchlist(filtered);
  }

  // App Settings
  async saveAppSettings(settings: any): Promise<void> {
    await this.setItem(STORAGE_KEYS.APP_SETTINGS, settings);
  }

  async getAppSettings(): Promise<any> {
    return this.getItem(STORAGE_KEYS.APP_SETTINGS) || {
      theme: 'system',
      language: 'en',
      notifications: true,
      hapticFeedback: true,
      soundEffects: true,
    };
  }

  // Cache Management
  async saveCache(cache: any): Promise<void> {
    await this.setItem(STORAGE_KEYS.APP_CACHE, cache);
  }

  async getCache(): Promise<any> {
    return this.getItem(STORAGE_KEYS.APP_CACHE) || {};
  }

  async clearCache(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.APP_CACHE);
  }

  // Search History
  async saveRecentSearches(searches: string[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.RECENT_SEARCHES, searches.slice(0, 10)); // Keep last 10
  }

  async getRecentSearches(): Promise<string[]> {
    return this.getItem(STORAGE_KEYS.RECENT_SEARCHES) || [];
  }

  async addRecentSearch(query: string): Promise<void> {
    const searches = await this.getRecentSearches();
    const filtered = searches.filter(s => s !== query);
    filtered.unshift(query);
    await this.saveRecentSearches(filtered);
  }

  // Favorites
  async saveFavorites(cards: any[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.FAVORITE_CARDS, cards);
  }

  async getFavorites(): Promise<any[]> {
    return this.getItem(STORAGE_KEYS.FAVORITE_CARDS) || [];
  }

  async addToFavorites(card: any): Promise<void> {
    const favorites = await this.getFavorites();
    const exists = favorites.some(f => f.id === card.id);

    if (!exists) {
      favorites.push({ ...card, dateAdded: new Date().toISOString() });
      await this.saveFavorites(favorites);
    }
  }

  async removeFromFavorites(cardId: string): Promise<void> {
    const favorites = await this.getFavorites();
    const filtered = favorites.filter(f => f.id !== cardId);
    await this.saveFavorites(filtered);
  }

  // Social Features (Local)
  async saveSocialPosts(posts: any[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.SOCIAL_POSTS, posts);
  }

  async getSocialPosts(): Promise<any[]> {
    return this.getItem(STORAGE_KEYS.SOCIAL_POSTS) || [];
  }

  async addSocialPost(post: any): Promise<void> {
    const posts = await this.getSocialPosts();
    posts.unshift({
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    });
    await this.saveSocialPosts(posts);
  }

  async likePost(postId: string): Promise<void> {
    const posts = await this.getSocialPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      post.liked = true;
      await this.saveSocialPosts(posts);
    }
  }

  async addComment(postId: string, comment: any): Promise<void> {
    const posts = await this.getSocialPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.comments.push({
        ...comment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });
      await this.saveSocialPosts(posts);
    }
  }

  // Analytics
  async saveUsageStats(stats: any): Promise<void> {
    await this.setItem(STORAGE_KEYS.APP_USAGE_STATS, stats);
  }

  async getUsageStats(): Promise<any> {
    return this.getItem(STORAGE_KEYS.APP_USAGE_STATS) || {
      sessions: 0,
      totalTimeSpent: 0,
      cardsViewed: 0,
      decksCreated: 0,
      searchesPerformed: 0,
      lastActive: null,
    };
  }

  async updateUsageStats(updates: Partial<any>): Promise<void> {
    const currentStats = await this.getUsageStats();
    const updatedStats = { ...currentStats, ...updates, lastActive: new Date().toISOString() };
    await this.saveUsageStats(updatedStats);
  }

  // Data Export/Import
  async exportData(): Promise<string> {
    const data = {
      userProfile: await this.getUserProfile(),
      userPreferences: await this.getUserPreferences(),
      collections: await this.getCollection(),
      decks: await this.getDecks(),
      watchlist: await this.getWatchlist(),
      favorites: await this.getFavorites(),
      socialPosts: await this.getSocialPosts(),
      appSettings: await this.getAppSettings(),
      usageStats: await this.getUsageStats(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);

      if (data.userProfile) await this.saveUserProfile(data.userProfile);
      if (data.userPreferences) await this.saveUserPreferences(data.userPreferences);
      if (data.collections) await this.saveCollection(data.collections);
      if (data.decks) await this.saveDecks(data.decks);
      if (data.watchlist) await this.saveWatchlist(data.watchlist);
      if (data.favorites) await this.saveFavorites(data.favorites);
      if (data.socialPosts) await this.saveSocialPosts(data.socialPosts);
      if (data.appSettings) await this.saveAppSettings(data.appSettings);
      if (data.usageStats) await this.saveUsageStats(data.usageStats);

      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid data format');
    }
  }

  // Utility methods
  async getStorageSize(): Promise<{ used: number; available: number }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }

      // Estimate available space (rough approximation)
      const available = 50 * 1024 * 1024; // 50MB estimate for mobile storage

      return { used: totalSize, available };
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return { used: 0, available: 0 };
    }
  }

  async cleanupOldData(): Promise<void> {
    // Remove data older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Clean up old search history (keep only recent)
    const recentSearches = await this.getRecentSearches();
    if (recentSearches.length > 20) {
      await this.saveRecentSearches(recentSearches.slice(0, 20));
    }

    console.log('Data cleanup completed');
  }
}

// Export singleton instance
export const localStorage = new LocalStorageService();
export default localStorage;