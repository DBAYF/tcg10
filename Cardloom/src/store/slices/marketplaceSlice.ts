import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Listing, Offer, Transaction, FilterOptions } from '../../types';

interface MarketplaceState {
  listings: Listing[];
  userListings: Listing[];
  offers: Offer[];
  transactions: Transaction[];
  filters: FilterOptions;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

const initialState: MarketplaceState = {
  listings: [],
  userListings: [],
  offers: [],
  transactions: [],
  filters: {},
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  },
};

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setListings: (state, action: PayloadAction<Listing[]>) => {
      state.listings = action.payload;
    },
    addListings: (state, action: PayloadAction<Listing[]>) => {
      state.listings.push(...action.payload);
    },
    setUserListings: (state, action: PayloadAction<Listing[]>) => {
      state.userListings = action.payload;
    },
    addUserListing: (state, action: PayloadAction<Listing>) => {
      state.userListings.unshift(action.payload);
    },
    updateUserListing: (state, action: PayloadAction<{ id: string; updates: Partial<Listing> }>) => {
      const index = state.userListings.findIndex(listing => listing.id === action.payload.id);
      if (index !== -1) {
        state.userListings[index] = { ...state.userListings[index], ...action.payload.updates };
      }
    },
    removeUserListing: (state, action: PayloadAction<string>) => {
      state.userListings = state.userListings.filter(listing => listing.id !== action.payload);
    },
    setOffers: (state, action: PayloadAction<Offer[]>) => {
      state.offers = action.payload;
    },
    addOffer: (state, action: PayloadAction<Offer>) => {
      state.offers.unshift(action.payload);
    },
    updateOffer: (state, action: PayloadAction<{ id: string; updates: Partial<Offer> }>) => {
      const index = state.offers.findIndex(offer => offer.id === action.payload.id);
      if (index !== -1) {
        state.offers[index] = { ...state.offers[index], ...action.payload.updates };
      }
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<{ id: string; updates: Partial<Transaction> }>) => {
      const index = state.transactions.findIndex(tx => tx.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = { ...state.transactions[index], ...action.payload.updates };
      }
    },
    setFilters: (state, action: PayloadAction<FilterOptions>) => {
      state.filters = action.payload;
    },
    setPagination: (state, action: PayloadAction<Partial<MarketplaceState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetMarketplace: (state) => {
      state.listings = [];
      state.filters = {};
      state.pagination = initialState.pagination;
    },
  },
});

export const {
  setListings,
  addListings,
  setUserListings,
  addUserListing,
  updateUserListing,
  removeUserListing,
  setOffers,
  addOffer,
  updateOffer,
  setTransactions,
  addTransaction,
  updateTransaction,
  setFilters,
  setPagination,
  setLoading,
  setError,
  resetMarketplace,
} = marketplaceSlice.actions;

export const selectMarketplace = (state: any) => state.marketplace;
export const selectListings = (state: any) => state.marketplace.listings;
export const selectUserListings = (state: any) => state.marketplace.userListings;
export const selectOffers = (state: any) => state.marketplace.offers;
export const selectTransactions = (state: any) => state.marketplace.transactions;
export const selectMarketplaceFilters = (state: any) => state.marketplace.filters;
export const selectMarketplaceLoading = (state: any) => state.marketplace.isLoading;

export default marketplaceSlice.reducer;