import { Model } from 'sequelize-typescript';
export declare class Event extends Model {
    title: string;
    description: string;
    gameId: string;
    eventType: string;
    source: string;
    startDate: Date;
    endDate: Date;
    location: object;
    maxAttendees?: number;
    currentAttendees: number;
    entryFee?: number;
    organizerId: number;
    coverImageUrl?: string;
}
//# sourceMappingURL=Event.d.ts.map