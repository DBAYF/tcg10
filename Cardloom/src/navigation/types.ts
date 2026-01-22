import { NavigatorScreenParams } from '@react-navigation/native';

// Tab navigation types
export type TabParamList = {
  Home: undefined;
  Cards: undefined;
  Market: undefined;
  Decks: undefined;
  Profile: undefined;
};

// Stack navigation types
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  Auth: undefined;
  CardDetail: { cardId: string };
  ListingDetail: { listingId: string };
  DeckDetail: { deckId: string };
  DeckBuilder: { deckId?: string };
  CreateListing: { cardId?: string };
  Profile: { userId: string };
  Messages: { conversationId?: string };
  Notifications: undefined;
  Settings: undefined;
  EventDetail: { eventId: string };
};

// Screen props types
export type HomeScreenProps = {
  navigation: any;
  route: any;
};

export type CardCatalogScreenProps = HomeScreenProps;
export type MarketplaceScreenProps = HomeScreenProps;
export type DecksScreenProps = HomeScreenProps;
export type ProfileScreenProps = HomeScreenProps;