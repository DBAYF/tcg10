import { Model } from 'sequelize-typescript';
export declare class Listing extends Model {
    sellerId: number;
    cardId: number;
    title: string;
    description?: string;
    price: number;
    condition: string;
    isFoil: boolean;
    quantity: number;
    listingType: string;
    status: string;
}
//# sourceMappingURL=Listing.d.ts.map