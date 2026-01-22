import { Model } from 'sequelize-typescript';
import { CardRarity } from '../../types/shared';
export declare class Card extends Model {
    gameId: string;
    setId: number;
    name: string;
    number: string;
    rarity: CardRarity;
    imageUrl: string;
    rulesText?: string;
    marketPrice?: number;
    attributes?: Record<string, any>;
    relatedCards?: string[];
    isActive: boolean;
    get fullName(): string;
    get displayRarity(): string;
}
//# sourceMappingURL=Card.d.ts.map