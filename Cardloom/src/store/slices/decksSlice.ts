import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Deck, DeckCard } from '../../types';

interface DecksState {
  decks: Deck[];
  userDecks: Deck[];
  currentDeck: Deck | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

const initialState: DecksState = {
  decks: [],
  userDecks: [],
  currentDeck: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  },
};

const decksSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    setDecks: (state, action: PayloadAction<Deck[]>) => {
      state.decks = action.payload;
    },
    addDecks: (state, action: PayloadAction<Deck[]>) => {
      state.decks.push(...action.payload);
    },
    setUserDecks: (state, action: PayloadAction<Deck[]>) => {
      state.userDecks = action.payload;
    },
    addUserDeck: (state, action: PayloadAction<Deck>) => {
      state.userDecks.unshift(action.payload);
    },
    updateUserDeck: (state, action: PayloadAction<{ id: string; updates: Partial<Deck> }>) => {
      const index = state.userDecks.findIndex(deck => deck.id === action.payload.id);
      if (index !== -1) {
        state.userDecks[index] = { ...state.userDecks[index], ...action.payload.updates };
      }

      // Also update in main decks array if present
      const mainIndex = state.decks.findIndex(deck => deck.id === action.payload.id);
      if (mainIndex !== -1) {
        state.decks[mainIndex] = { ...state.decks[mainIndex], ...action.payload.updates };
      }
    },
    removeUserDeck: (state, action: PayloadAction<string>) => {
      state.userDecks = state.userDecks.filter(deck => deck.id !== action.payload);
      state.decks = state.decks.filter(deck => deck.id !== action.payload);
    },
    setCurrentDeck: (state, action: PayloadAction<Deck | null>) => {
      state.currentDeck = action.payload;
    },
    updateCurrentDeck: (state, action: PayloadAction<Partial<Deck>>) => {
      if (state.currentDeck) {
        state.currentDeck = { ...state.currentDeck, ...action.payload };
      }
    },
    addCardToCurrentDeck: (state, action: PayloadAction<DeckCard>) => {
      if (state.currentDeck) {
        // This would need to be handled by the deck building logic
        // For now, we'll just update the stats
        state.currentDeck.stats.totalCards += action.payload.quantity;
      }
    },
    removeCardFromCurrentDeck: (state, action: PayloadAction<{ cardId: string; quantity: number }>) => {
      if (state.currentDeck) {
        state.currentDeck.stats.totalCards = Math.max(0, state.currentDeck.stats.totalCards - action.payload.quantity);
      }
    },
    setPagination: (state, action: PayloadAction<Partial<DecksState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetDecks: (state) => {
      state.decks = [];
      state.pagination = initialState.pagination;
    },
  },
});

export const {
  setDecks,
  addDecks,
  setUserDecks,
  addUserDeck,
  updateUserDeck,
  removeUserDeck,
  setCurrentDeck,
  updateCurrentDeck,
  addCardToCurrentDeck,
  removeCardFromCurrentDeck,
  setPagination,
  setLoading,
  setError,
  resetDecks,
} = decksSlice.actions;

export const selectDecks = (state: any) => state.decks;
export const selectAllDecks = (state: any) => state.decks.decks;
export const selectUserDecks = (state: any) => state.decks.userDecks;
export const selectCurrentDeck = (state: any) => state.decks.currentDeck;
export const selectDecksLoading = (state: any) => state.decks.isLoading;

export default decksSlice.reducer;