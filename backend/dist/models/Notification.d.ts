import { Model } from 'sequelize-typescript';
export declare class Notification extends Model {
    userId: number;
    type: string;
    title: string;
    message: string;
    data?: object;
    isRead: boolean;
}
//# sourceMappingURL=Notification.d.ts.map