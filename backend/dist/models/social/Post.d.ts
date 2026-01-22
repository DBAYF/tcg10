import { Model } from 'sequelize-typescript';
export declare class Post extends Model {
    authorId: number;
    content: string;
    images?: string[];
    relatedDeckId?: number;
    relatedListingId?: number;
    relatedEventId?: number;
    likes: number;
    comments: number;
}
//# sourceMappingURL=Post.d.ts.map