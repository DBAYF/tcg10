import { Model } from 'sequelize-typescript';
export declare class Review extends Model {
    reviewerId: number;
    revieweeId: number;
    transactionId: number;
    rating: number;
    comment?: string;
}
//# sourceMappingURL=Review.d.ts.map