import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post, Message, Conversation, Comment } from '../../types';

interface SocialState {
  feed: Post[];
  messages: Message[];
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  feedPagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  unreadMessageCount: number;
}

const initialState: SocialState = {
  feed: [],
  messages: [],
  conversations: [],
  isLoading: false,
  error: null,
  feedPagination: {
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  },
  unreadMessageCount: 0,
};

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setFeed: (state, action: PayloadAction<Post[]>) => {
      state.feed = action.payload;
    },
    addFeedPosts: (state, action: PayloadAction<Post[]>) => {
      state.feed.push(...action.payload);
    },
    addFeedPost: (state, action: PayloadAction<Post>) => {
      state.feed.unshift(action.payload);
    },
    updateFeedPost: (state, action: PayloadAction<{ id: string; updates: Partial<Post> }>) => {
      const index = state.feed.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.feed[index] = { ...state.feed[index], ...action.payload.updates };
      }
    },
    removeFeedPost: (state, action: PayloadAction<string>) => {
      state.feed = state.feed.filter(post => post.id !== action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      if (!action.payload.isRead) {
        state.unreadMessageCount += 1;
      }
    },
    markMessageRead: (state, action: PayloadAction<string>) => {
      const message = state.messages.find(msg => msg.id === action.payload);
      if (message && !message.isRead) {
        message.isRead = true;
        state.unreadMessageCount = Math.max(0, state.unreadMessageCount - 1);
      }
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      state.unreadMessageCount = action.payload.reduce((total, conv) => total + conv.unreadCount, 0);
    },
    updateConversation: (state, action: PayloadAction<{ id: string; updates: Partial<Conversation> }>) => {
      const index = state.conversations.findIndex(conv => conv.id === action.payload.id);
      if (index !== -1) {
        state.conversations[index] = { ...state.conversations[index], ...action.payload.updates };
        state.unreadMessageCount = state.conversations.reduce((total, conv) => total + conv.unreadCount, 0);
      }
    },
    setFeedPagination: (state, action: PayloadAction<Partial<SocialState['feedPagination']>>) => {
      state.feedPagination = { ...state.feedPagination, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetSocial: (state) => {
      state.feed = [];
      state.feedPagination = initialState.feedPagination;
    },
  },
});

export const {
  setFeed,
  addFeedPosts,
  addFeedPost,
  updateFeedPost,
  removeFeedPost,
  setMessages,
  addMessage,
  markMessageRead,
  setConversations,
  updateConversation,
  setFeedPagination,
  setLoading,
  setError,
  resetSocial,
} = socialSlice.actions;

export const selectSocial = (state: any) => state.social;
export const selectFeed = (state: any) => state.social.feed;
export const selectMessages = (state: any) => state.social.messages;
export const selectConversations = (state: any) => state.social.conversations;
export const selectUnreadMessageCount = (state: any) => state.social.unreadMessageCount;
export const selectSocialLoading = (state: any) => state.social.isLoading;

export default socialSlice.reducer;