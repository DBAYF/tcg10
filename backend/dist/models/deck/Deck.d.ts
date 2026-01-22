import { Model } from 'sequelize-typescript';
export declare class Deck extends Model {
    userId: number;
    gameId: string;
    title: string;
    description?: string;
    format: string;
    isPublic: boolean;
    coverImageUrl?: string;
    tags: string[];
}
//# sourceMappingURL=Deck.d.ts.map