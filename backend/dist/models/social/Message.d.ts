import { Model } from 'sequelize-typescript';
export declare class Message extends Model {
    senderId: number;
    recipientId: number;
    content: string;
    images?: string[];
    relatedListingId?: number;
    isRead: boolean;
}
//# sourceMappingURL=Message.d.ts.map