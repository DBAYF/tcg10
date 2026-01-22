import axios from 'axios';

// TCG API Base URLs and Keys
export const TCG_APIS = {
  pokemon: {
    baseUrl: 'https://api.pokemontcg.io/v2',
    apiKey: process.env.EXPO_PUBLIC_POKEMON_TCG_API_KEY || '',
    name: 'Pokémon TCG',
  },
  mtg: {
    baseUrl: 'https://api.scryfall.com',
    apiKey: '', // Scryfall doesn't require API key for basic usage
    name: 'Magic: The Gathering',
  },
  yugioh: {
    baseUrl: 'https://db.ygoprodeck.com/api/v7',
    apiKey: '', // YGOProDeck doesn't require API key
    name: 'Yu-Gi-Oh!',
  },
  lorcana: {
    baseUrl: '', // Will use mock data or find alternative
    apiKey: '',
    name: 'Disney Lorcana',
  },
  one_piece: {
    baseUrl: '', // Will use mock data
    apiKey: '',
    name: 'One Piece TCG',
  },
};

// API Response Types
export interface TCGCard {
  id: string;
  name: string;
  game: string;
  set?: string;
  rarity?: string;
  type?: string;
  imageUrl?: string;
  price?: number;
  attributes?: Record<string, any>;
  text?: string;
  artist?: string;
  flavorText?: string;
  power?: string;
  toughness?: string;
  manaCost?: string;
  convertedManaCost?: number;
  colors?: string[];
  supertypes?: string[];
  subtypes?: string[];
  releaseDate?: string;
}

export interface TCGSet {
  id: string;
  name: string;
  code: string;
  game: string;
  releaseDate: string;
  totalCards: number;
  logoUrl?: string;
}

export interface TCGSearchFilters {
  game?: string;
  name?: string;
  set?: string;
  rarity?: string;
  type?: string;
  colors?: string[];
  manaCost?: string;
  power?: string;
  toughness?: string;
  priceMin?: number;
  priceMax?: number;
  artist?: string;
  flavorText?: boolean;
  limit?: number;
  offset?: number;
}

export interface TCGSearchResult {
  cards: TCGCard[];
  totalCount: number;
  hasMore: boolean;
  filters: TCGSearchFilters;
}

// API Service Class
class TCGApiService {
  private async makeRequest(url: string, params?: Record<string, any>) {
    try {
      const response = await axios.get(url, {
        params,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error('TCG API Error:', error);
      throw new Error(`Failed to fetch from TCG API: ${error.message}`);
    }
  }

  // Pokemon TCG API Integration
  async searchPokemonCards(filters: TCGSearchFilters): Promise<TCGSearchResult> {
    const params: Record<string, any> = {
      pageSize: filters.limit || 50,
      page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
    };

    if (filters.name) params.q = `name:"${filters.name}"*`;
    if (filters.set) params.q = (params.q ? params.q + ' ' : '') + `set.id:${filters.set}`;
    if (filters.rarity) params.q = (params.q ? params.q + ' ' : '') + `rarity:"${filters.rarity}"`;
    if (filters.type) params.q = (params.q ? params.q + ' ' : '') + `types:"${filters.type}"`;

    const data = await this.makeRequest(`${TCG_APIS.pokemon.baseUrl}/cards`, params);

    return {
      cards: data.data.map(this.transformPokemonCard),
      totalCount: data.totalCount || data.data.length,
      hasMore: data.hasMore || false,
      filters,
    };
  }

  async getPokemonCard(cardId: string): Promise<TCGCard> {
    const data = await this.makeRequest(`${TCG_APIS.pokemon.baseUrl}/cards/${cardId}`);
    return this.transformPokemonCard(data.data);
  }

  async getPokemonSets(): Promise<TCGSet[]> {
    const data = await this.makeRequest(`${TCG_APIS.pokemon.baseUrl}/sets`);
    return data.data.map(this.transformPokemonSet);
  }

  private transformPokemonCard(card: any): TCGCard {
    return {
      id: card.id,
      name: card.name,
      game: 'pokemon',
      set: card.set?.id,
      rarity: card.rarity,
      type: card.types?.[0],
      imageUrl: card.images?.large,
      price: card.cardmarket?.prices?.averageSellPrice,
      attributes: {
        hp: card.hp,
        types: card.types,
        subtypes: card.subtypes,
        supertype: card.supertype,
        evolvesFrom: card.evolvesFrom,
        evolvesTo: card.evolvesTo,
        rules: card.rules,
        attacks: card.attacks,
        weaknesses: card.weaknesses,
        resistances: card.resistances,
        retreatCost: card.retreatCost,
        convertedRetreatCost: card.convertedRetreatCost,
        cardmarket: card.cardmarket,
        tcgplayer: card.tcgplayer,
      },
      text: card.flavorText,
      artist: card.artist,
      releaseDate: card.set?.releaseDate,
    };
  }

  private transformPokemonSet(set: any): TCGSet {
    return {
      id: set.id,
      name: set.name,
      code: set.ptcgoCode || set.id,
      game: 'pokemon',
      releaseDate: set.releaseDate,
      totalCards: set.total || 0,
      logoUrl: set.images?.logo,
    };
  }

  // MTG (Scryfall) API Integration
  async searchMTGCards(filters: TCGSearchFilters): Promise<TCGSearchResult> {
    let query = '';

    if (filters.name) query += `name:"${filters.name}" `;
    if (filters.set) query += `set:${filters.set} `;
    if (filters.rarity) query += `rarity:${filters.rarity} `;
    if (filters.type) query += `type:${filters.type} `;
    if (filters.colors && filters.colors.length > 0) {
      query += `color:${filters.colors.join('')}`;
    }
    if (filters.manaCost) query += `mana:${filters.manaCost} `;
    if (filters.power) query += `pow:${filters.power} `;
    if (filters.toughness) query += `tou:${filters.toughness} `;

    const params: Record<string, any> = {
      q: query.trim(),
      unique: 'cards',
      order: 'name',
      dir: 'auto',
      page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
    };

    const data = await this.makeRequest(`${TCG_APIS.mtg.baseUrl}/cards/search`, params);

    return {
      cards: data.data.map(this.transformMTGCard),
      totalCount: data.total_cards || data.data.length,
      hasMore: data.has_more || false,
      filters,
    };
  }

  async getMTGCard(cardId: string): Promise<TCGCard> {
    const data = await this.makeRequest(`${TCG_APIS.mtg.baseUrl}/cards/${cardId}`);
    return this.transformMTGCard(data);
  }

  async getMTGSets(): Promise<TCGSet[]> {
    const data = await this.makeRequest(`${TCG_APIS.mtg.baseUrl}/sets`);
    return data.data
      .filter((set: any) => set.set_type !== 'token' && set.set_type !== 'memorabilia')
      .map(this.transformMTGSet);
  }

  private transformMTGCard(card: any): TCGCard {
    return {
      id: card.id,
      name: card.name,
      game: 'mtg',
      set: card.set,
      rarity: card.rarity,
      type: card.type_line,
      imageUrl: card.image_uris?.normal || card.image_uris?.large,
      price: card.prices?.usd ? parseFloat(card.prices.usd) : undefined,
      attributes: {
        manaCost: card.mana_cost,
        convertedManaCost: card.cmc,
        colors: card.colors,
        colorIdentity: card.color_identity,
        supertypes: card.supertypes || [],
        subtypes: card.subtypes || [],
        power: card.power,
        toughness: card.toughness,
        loyalty: card.loyalty,
        defense: card.defense,
        oracleText: card.oracle_text,
        flavorText: card.flavor_text,
        artist: card.artist,
        frame: card.frame,
        layout: card.layout,
        legalities: card.legalities,
        prices: card.prices,
        relatedCards: card.all_parts,
      },
      text: card.oracle_text,
      artist: card.artist,
      flavorText: card.flavor_text,
      power: card.power,
      toughness: card.toughness,
      manaCost: card.mana_cost,
      convertedManaCost: card.cmc,
      colors: card.colors,
      supertypes: card.supertypes || [],
      subtypes: card.subtypes || [],
      releaseDate: card.released_at,
    };
  }

  private transformMTGSet(set: any): TCGSet {
    return {
      id: set.code,
      name: set.name,
      code: set.code,
      game: 'mtg',
      releaseDate: set.released_at,
      totalCards: set.card_count || 0,
      logoUrl: set.icon_svg_uri,
    };
  }

  // Yu-Gi-Oh! API Integration
  async searchYugiohCards(filters: TCGSearchFilters): Promise<TCGSearchResult> {
    const params: Record<string, any> = {
      num: filters.limit || 50,
      offset: filters.offset || 0,
    };

    if (filters.name) params.fname = filters.name;

    const data = await this.makeRequest(`${TCG_APIS.yugioh.baseUrl}/cardinfo.php`, params);

    return {
      cards: data.data.map(this.transformYugiohCard),
      totalCount: data.meta?.total_rows || data.data.length,
      hasMore: (filters.offset || 0) + (filters.limit || 50) < (data.meta?.total_rows || data.data.length),
      filters,
    };
  }

  async getYugiohCard(cardId: string): Promise<TCGCard> {
    const data = await this.makeRequest(`${TCG_APIS.yugioh.baseUrl}/cardinfo.php`, { id: cardId });
    return this.transformYugiohCard(data.data[0]);
  }

  private transformYugiohCard(card: any): TCGCard {
    return {
      id: card.id.toString(),
      name: card.name,
      game: 'yugioh',
      set: card.card_sets?.[0]?.set_code,
      rarity: card.card_sets?.[0]?.set_rarity,
      type: card.type,
      imageUrl: card.card_images?.[0]?.image_url,
      price: card.card_prices?.[0]?.tcgplayer_price ? parseFloat(card.card_prices[0].tcgplayer_price) : undefined,
      attributes: {
        humanReadableCardType: card.humanReadableCardType,
        frameType: card.frameType,
        race: card.race,
        archetype: card.archetype,
        linkval: card.linkval,
        linkmarkers: card.linkmarkers,
        scale: card.scale,
        atk: card.atk,
        def: card.def,
        level: card.level,
        attribute: card.attribute,
        cardSets: card.card_sets,
        cardImages: card.card_images,
        cardPrices: card.card_prices,
      },
      text: card.desc,
      power: card.atk?.toString(),
      toughness: card.def?.toString(),
    };
  }

  // Mock data for Lorcana and One Piece (no free APIs available)
  async searchLorcanaCards(filters: TCGSearchFilters): Promise<TCGSearchResult> {
    // Return mock data for Lorcana
    const mockCards: TCGCard[] = [
      {
        id: 'lor-1',
        name: 'Mickey Mouse',
        game: 'lorcana',
        set: 'TFC',
        rarity: 'Legendary',
        type: 'Character',
        imageUrl: 'https://example.com/lorcana/mickey.jpg',
        price: 45.99,
        attributes: {
          cost: 3,
          strength: 4,
          willpower: 3,
          lore: 1,
        },
        text: 'Disney Lorcana character card',
      },
      // Add more mock cards...
    ];

    return {
      cards: mockCards.filter(card =>
        !filters.name || card.name.toLowerCase().includes(filters.name.toLowerCase())
      ).slice(filters.offset || 0, (filters.offset || 0) + (filters.limit || 50)),
      totalCount: mockCards.length,
      hasMore: false,
      filters,
    };
  }

  async searchOnePieceCards(filters: TCGSearchFilters): Promise<TCGSearchResult> {
    // Return mock data for One Piece
    const mockCards: TCGCard[] = [
      {
        id: 'op-1',
        name: 'Monkey D. Luffy',
        game: 'one_piece',
        set: 'OP01',
        rarity: 'Leader',
        type: 'Character',
        imageUrl: 'https://example.com/onepiece/luffy.jpg',
        price: 25.99,
        attributes: {
          cost: 0,
          power: 5000,
          counter: 1000,
          color: 'Red',
          type: 'Supernovas',
        },
        text: 'One Piece TCG character card',
      },
      // Add more mock cards...
    ];

    return {
      cards: mockCards.filter(card =>
        !filters.name || card.name.toLowerCase().includes(filters.name.toLowerCase())
      ).slice(filters.offset || 0, (filters.offset || 0) + (filters.limit || 50)),
      totalCount: mockCards.length,
      hasMore: false,
      filters,
    };
  }

  // Unified search method
  async searchCards(game: string, filters: TCGSearchFilters): Promise<TCGSearchResult> {
    switch (game) {
      case 'pokemon':
        return this.searchPokemonCards(filters);
      case 'mtg':
        return this.searchMTGCards(filters);
      case 'yugioh':
        return this.searchYugiohCards(filters);
      case 'lorcana':
        return this.searchLorcanaCards(filters);
      case 'one_piece':
        return this.searchOnePieceCards(filters);
      default:
        throw new Error(`Unsupported game: ${game}`);
    }
  }

  async getCard(game: string, cardId: string): Promise<TCGCard> {
    switch (game) {
      case 'pokemon':
        return this.getPokemonCard(cardId);
      case 'mtg':
        return this.getMTGCard(cardId);
      case 'yugioh':
        return this.getYugiohCard(cardId);
      default:
        throw new Error(`Unsupported game: ${game}`);
    }
  }

  async getSets(game: string): Promise<TCGSet[]> {
    switch (game) {
      case 'pokemon':
        return this.getPokemonSets();
      case 'mtg':
        return this.getMTGSets();
      default:
        return [];
    }
  }
}

// Export singleton instance
export const tcgApi = new TCGApiService();
export default tcgApi;