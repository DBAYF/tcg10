import { Model } from 'sequelize-typescript';
export declare class Comment extends Model {
    postId: number;
    authorId: number;
    content: string;
    parentCommentId?: number;
    likes: number;
}
//# sourceMappingURL=Comment.d.ts.map