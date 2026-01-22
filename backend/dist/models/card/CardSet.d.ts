import { Model } from 'sequelize-typescript';
export declare class CardSet extends Model {
    gameId: string;
    name: string;
    code: string;
    releaseDate: Date;
    totalCards: number;
    logoUrl?: string;
    description?: string;
    block?: string;
    setType?: string;
}
//# sourceMappingURL=CardSet.d.ts.map