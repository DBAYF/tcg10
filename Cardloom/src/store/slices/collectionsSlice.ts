import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CollectionItem, Card } from '../../types';

interface CollectionsState {
  items: CollectionItem[];
  totalValue: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CollectionsState = {
  items: [],
  totalValue: 0,
  isLoading: false,
  error: null,
};

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<CollectionItem[]>) => {
      state.items = action.payload;
      state.totalValue = action.payload.reduce((total, item) => total + (item.purchasePrice || 0) * item.quantity, 0);
    },
    addItem: (state, action: PayloadAction<CollectionItem>) => {
      state.items.push(action.payload);
      state.totalValue += (action.payload.purchasePrice || 0) * action.payload.quantity;
    },
    updateItem: (state, action: PayloadAction<{ id: string; updates: Partial<CollectionItem> }>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        const oldItem = state.items[index];
        state.items[index] = { ...oldItem, ...action.payload.updates };
        // Recalculate total value
        state.totalValue = state.items.reduce((total, item) => total + (item.purchasePrice || 0) * item.quantity, 0);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        const removedItem = state.items[index];
        state.items.splice(index, 1);
        state.totalValue -= (removedItem.purchasePrice || 0) * removedItem.quantity;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setItems,
  addItem,
  updateItem,
  removeItem,
  setLoading,
  setError,
} = collectionsSlice.actions;

export const selectCollections = (state: any) => state.collections;
export const selectCollectionItems = (state: any) => state.collections.items;
export const selectTotalValue = (state: any) => state.collections.totalValue;
export const selectCollectionsLoading = (state: any) => state.collections.isLoading;

export default collectionsSlice.reducer;